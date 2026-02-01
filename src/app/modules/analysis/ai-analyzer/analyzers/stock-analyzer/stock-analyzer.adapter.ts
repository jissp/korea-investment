import { chunk } from 'lodash';
import { FlowChildJob } from 'bullmq/dist/esm/interfaces/flow-job';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { uniqueValues } from '@common/utils';
import { getStockName } from '@common/domains';
import { GeminiCliModel } from '@modules/gemini-cli';
import {
    NaverApiClientFactory,
    NaverApiNewsItem,
    NaverAppName,
} from '@modules/naver/naver-api';
import { MarketDivCode } from '@modules/korea-investment/common';
import {
    DomesticStockInvestorTrendEstimateOutput2,
    DomesticStockQuotationsInquireInvestorOutput,
    KoreaInvestmentQuotationClient,
} from '@modules/korea-investment/korea-investment-quotation-client';
import { YN } from '@app/common/types';
import { Stock, StockService } from '@app/modules/repositories/stock';
import { NewsService, StockNews } from '@app/modules/repositories/news';
import {
    AiAnalyzerQueueType,
    BaseAnalysisAdapter,
    NewsPromptTransformer,
    PromptToGeminiCliBody,
} from '@app/modules/analysis/ai-analyzer';
import { StockAnalyzerFlowType } from './stock-analyzer.types';
import {
    RiggedStockIssuePromptTransformer,
    StockIssuePromptTransformer,
} from './transformers';

const DEFAULT_CHUNK_SIZE = 5;

export interface StockAnalysisData {
    stock: Stock;
    stockInvestors: DomesticStockQuotationsInquireInvestorOutput[];
    stockInvestorByEstimates: DomesticStockInvestorTrendEstimateOutput2[];
    keywords: string[];
    naverNewsItems: NaverApiNewsItem[];
    stockNews: StockNews[];
}

@Injectable()
export class StockAnalyzerAdapter implements BaseAnalysisAdapter<StockAnalysisData> {
    private readonly logger = new Logger(StockAnalyzerAdapter.name);

    constructor(
        private readonly naverApiClientFactory: NaverApiClientFactory,
        private readonly koreaInvestmentQuotationClient: KoreaInvestmentQuotationClient,
        private readonly stockService: StockService,
        private readonly newsService: NewsService,
        private readonly newsPromptTransformer: NewsPromptTransformer,
        private readonly stockIssuePromptTransformer: StockIssuePromptTransformer,
        private readonly riggedStockIssuePromptTransformer: RiggedStockIssuePromptTransformer,
    ) {}

    /**
     * 분석에 필요한 데이터를 수집합니다.
     * @param stockCode
     */
    async collectData(stockCode: string): Promise<StockAnalysisData> {
        const stock = await this.stockService.getStock(stockCode);
        if (!stock) {
            throw new NotFoundException(`Stock not found: ${stockCode}`);
        }

        const marketDivCode =
            stock.isNextTrade === YN.Y ? MarketDivCode.통합 : MarketDivCode.KRX;

        const [stockInvestors, stockInvestorByEstimates, stockNews] =
            await Promise.all([
                this.koreaInvestmentQuotationClient.inquireInvestor({
                    FID_INPUT_ISCD: stockCode,
                    FID_COND_MRKT_DIV_CODE: marketDivCode,
                }),
                this.koreaInvestmentQuotationClient.inquireInvestorByEstimate({
                    MKSC_SHRN_ISCD: stockCode,
                }),
                this.newsService.getStockNewsList({
                    stockCode,
                    limit: 30,
                }),
            ]);

        const keywords = this.getKeywords(stockCode);
        const naverNewsItems = await this.getNaverNewsItems(keywords);

        return {
            stock,
            stockInvestors,
            stockInvestorByEstimates,
            keywords,
            naverNewsItems,
            stockNews,
        };
    }

    public transformToTitle(data: StockAnalysisData) {
        return `${data.stock.name} 종목 분석`;
    }

    public transformToFlowChildJob(data: StockAnalysisData): FlowChildJob {
        const queueName = StockAnalyzerFlowType.Request;

        return {
            queueName,
            name: queueName,
            data,
            children: [
                {
                    queueName: AiAnalyzerQueueType.PromptToGeminiCli,
                    name: '종목의 현재 이슈, 정책 등을 조회',
                    data: {
                        prompt: this.stockIssuePromptTransformer.transform({
                            stockName: data.stock.name,
                        }),
                        model: GeminiCliModel.Gemini3Flash,
                    } as PromptToGeminiCliBody,
                },
                {
                    queueName: AiAnalyzerQueueType.PromptToGeminiCli,
                    name: '종목의 최근 뉴스 정보 분석',
                    data: {
                        prompt: this.newsPromptTransformer.transform({
                            news: data.stockNews,
                            naverNewsItems: data.naverNewsItems,
                        }),
                        model: GeminiCliModel.Gemini3Flash,
                    } as PromptToGeminiCliBody,
                },
                {
                    queueName: AiAnalyzerQueueType.PromptToGeminiCli,
                    name: '종목의 세력 설계 분석',
                    data: {
                        prompt: this.riggedStockIssuePromptTransformer.transform(
                            {
                                stockName: data.stock.name,
                                stockInvestors: data.stockInvestors,
                                stockInvestorByEstimates:
                                    data.stockInvestorByEstimates,
                            },
                        ),
                        model: GeminiCliModel.Gemini3Flash,
                    } as PromptToGeminiCliBody,
                },
            ],
        };
    }

    /**
     * @param stockCode
     * @private
     */
    private getKeywords(stockCode: string): string[] {
        // TODO: Implement stock-keyword mapping feature
        const keywords: string[] = [];

        const stockName = getStockName(stockCode);
        const allKeywords: string[] = [stockName, ...keywords];

        return uniqueValues(allKeywords);
    }

    /**
     * 네이버 검색 API를 사용하여 뉴스 정보를 가지고 옵니다.
     * @param keywords
     * @protected
     */
    private async getNaverNewsItems(
        keywords: string[],
    ): Promise<NaverApiNewsItem[]> {
        const maxPage = keywords.length < 2 ? 1 : 2;
        const arr = Array.from({ length: maxPage }, (_, i) => i + 1);

        const client = this.naverApiClientFactory.create(NaverAppName.SEARCH);

        const keywordChunk = chunk(keywords, DEFAULT_CHUNK_SIZE);

        const responses = await Promise.all(
            keywordChunk.flatMap((keywords) =>
                arr.map((page) =>
                    client.getNews({
                        query: keywords.join(' | '),
                        start: page,
                        display: 100,
                        sort: 'date',
                    }),
                ),
            ),
        );

        return responses.flatMap((response) => response.items);
    }
}
