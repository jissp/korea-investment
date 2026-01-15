import * as _ from 'lodash';
import { Injectable, Logger } from '@nestjs/common';
import { uniqueValues } from '@common/utils';
import { getStockName } from '@common/domains';
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
import { YN } from '@app/common';
import { Stock, StockService } from '@app/modules/repositories/stock';
import { NewsService, StockNews } from '@app/modules/repositories/news';
import { ReportType } from '@app/modules/repositories/ai-analysis-report';
import { AnalyzeStockPromptTransformer } from '../transformers';
import { AnalysisCompletedEventBody } from '../stock-analyzer.types';
import { IAnalysisAdapter } from './analysis-adapter.interface';

const DEFAULT_CHUNK_SIZE = 5;

interface StockAnalysisData {
    stock: Stock;
    stockInvestors: DomesticStockQuotationsInquireInvestorOutput[];
    stockInvestorByEstimates: DomesticStockInvestorTrendEstimateOutput2[];
    keywords: string[];
    naverNewsItems: NaverApiNewsItem[];
    stockNews: StockNews[];
}

@Injectable()
export class StockAnalysisAdapter implements IAnalysisAdapter<StockAnalysisData> {
    private readonly logger = new Logger(StockAnalysisAdapter.name);

    constructor(
        private readonly naverApiClientFactory: NaverApiClientFactory,
        private readonly koreaInvestmentQuotationClient: KoreaInvestmentQuotationClient,
        private readonly stockService: StockService,
        private readonly newsService: NewsService,
    ) {}

    /**
     * 분석에 필요한 데이터를 수집합니다.
     * @param stockCode
     */
    async collectData(stockCode: string): Promise<StockAnalysisData> {
        const stock = await this.stockService.getStock(stockCode);
        if (!stock) {
            throw new Error(`Stock not found: ${stockCode}`);
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

    /**
     * 데이터를 프롬프트로 변환합니다.
     * @param data
     */
    transformToPrompt(data: StockAnalysisData): string {
        const transformer = new AnalyzeStockPromptTransformer();

        return transformer.transform({
            stockName: getStockName(data.stock.shortCode),
            stockNewsItems: data.stockNews,
            stockInvestors: data.stockInvestors,
            naverNewsItems: data.naverNewsItems,
            stockInvestorByEstimates: data.stockInvestorByEstimates,
        });
    }

    /**
     * 분석 완료 이벤트 객체를 생성합니다.
     * @param target
     * @param data
     */
    getEventConfig(
        target: string,
        data: StockAnalysisData,
    ): AnalysisCompletedEventBody {
        return {
            reportType: ReportType.Stock,
            reportTarget: data.stock.shortCode,
            title: `${data.stock.name} 종목 분석 리포트`,
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

        const keywordChunk = _.chunk(keywords, DEFAULT_CHUNK_SIZE);

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
