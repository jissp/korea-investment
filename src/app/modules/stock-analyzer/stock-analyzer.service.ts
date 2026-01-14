import * as _ from 'lodash';
import { Injectable, Logger } from '@nestjs/common';
import { getStockName } from '@common/domains';
import { uniqueValues } from '@common/utils';
import { GeminiCliService } from '@modules/gemini-cli';
import { NaverApiClientFactory, NaverAppName } from '@modules/naver/naver-api';
import { MarketDivCode } from '@modules/korea-investment/common';
import { KoreaInvestmentQuotationClient } from '@modules/korea-investment/korea-investment-quotation-client';
import { StockService } from '@app/modules/repositories/stock';
import {
    KeywordGroupService,
    KeywordService,
} from '@app/modules/repositories/keyword';
import { StockAnalyzerEventType } from './stock-analyzer.types';
import {
    AnalyzeKeywordGroupPromptTransformer,
    AnalyzeStockPromptTransformer,
} from './transformers';
import { YN } from '@app/common';

const DEFAULT_CHUNK_SIZE = 5;

@Injectable()
export class StockAnalyzerService {
    private readonly logger = new Logger(StockAnalyzerService.name);

    constructor(
        private readonly geminiCliService: GeminiCliService,
        private readonly naverApiClientFactory: NaverApiClientFactory,
        private readonly koreaInvestmentQuotationClient: KoreaInvestmentQuotationClient,
        private readonly stockService: StockService,
        private readonly keywordService: KeywordService,
        private readonly keywordGroupService: KeywordGroupService,
    ) {}

    /**
     * Gemini를 통해 주식의 흐름을 분석합니다.
     * @param stockCode 종목 코드
     */
    public async requestAnalyzeStock(stockCode: string) {
        try {
            const stock = await this.stockService.getStock(stockCode);
            if (!stock) {
                return;
            }

            const marketDivCode =
                stock.isNextTrade === YN.Y
                    ? MarketDivCode.통합
                    : MarketDivCode.KRX;
            const stockInvestors =
                await this.koreaInvestmentQuotationClient.inquireInvestor({
                    FID_INPUT_ISCD: stockCode,
                    FID_COND_MRKT_DIV_CODE: marketDivCode,
                });

            const keywords = await this.getKeywords(stockCode);
            const naverNewsItems = await this.getNaverNewsItems(keywords);

            const transformer = new AnalyzeStockPromptTransformer();

            this.geminiCliService.requestPrompt({
                callbackEvent: {
                    eventName: StockAnalyzerEventType.AnalysisCompleted,
                    eventData: {
                        stockCode,
                    },
                },
                prompt: transformer.transform({
                    stockName: getStockName(stockCode),
                    stockInvestors,
                    naverNewsItems,
                }),
            });
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    /**
     * Gemini를 통해 키워드 그룹의 흐름을 분석합니다.
     * @param groupId
     */
    public async requestAnalyzeKeywordGroup(groupId: number) {
        try {
            const keywordGroup =
                await this.keywordGroupService.getKeywordGroup(groupId);
            if (!keywordGroup) {
                throw new Error(`키워드 그룹이 존재하지 않습니다.`);
            }

            const keywords =
                await this.keywordService.getKeywordsByGroupId(groupId);
            const naverNewsItems = await this.getNaverNewsItems(
                keywords.map(({ name }) => name),
            );

            const transformer = new AnalyzeKeywordGroupPromptTransformer();
            this.geminiCliService.requestPrompt({
                callbackEvent: {
                    eventName:
                        StockAnalyzerEventType.AnalysisCompletedForKeywordGroup,
                    eventData: {
                        keywordGroup,
                    },
                },
                prompt: transformer.transform({
                    groupName: keywordGroup.name,
                    naverNewsItems,
                }),
            });
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    /**
     * 해당 종목을 위한 검색 키워드 목록을 조회합니다.
     * @param stockCode
     * @private
     */
    private async getKeywords(stockCode: string): Promise<string[]> {
        // TODO 추후 종목 - 키워드 기능을 추가해야할 수 있음.
        const keywords: string[] = [];

        const stockName = getStockName(stockCode);
        const allKeywords: string[] = [stockName, ...keywords];

        return uniqueValues(allKeywords);
    }

    /**
     * 실시간으로 네이버 뉴스를 조회합니다.
     * @param keywords
     * @private
     */
    private async getNaverNewsItems(keywords: string[]) {
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
