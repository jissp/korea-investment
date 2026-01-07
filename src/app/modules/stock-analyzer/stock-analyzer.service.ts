import { Injectable, Logger } from '@nestjs/common';
import { getStockName } from '@common/domains';
import { uniqueValues } from '@common/utils';
import { GeminiCliService } from '@modules/gemini-cli';
import { NaverApiClientFactory, NaverAppName } from '@modules/naver/naver-api';
import { MarketDivCode } from '@modules/korea-investment/common';
import { KoreaInvestmentQuotationClient } from '@modules/korea-investment/korea-investment-quotation-client';
import { KoreaInvestmentKeywordSettingService } from '@app/modules/korea-investment-setting';
import { StockAnalyzerEventType } from './stock-analyzer.types';
import { AnalyzeStockPromptTransformer } from './transformers/analyze-stock-prompt.transformer';
import { AnalyzeKeywordGroupPromptTransformer } from './transformers/analyze-keyword-group-prompt.transformer';

@Injectable()
export class StockAnalyzerService {
    private readonly logger = new Logger(StockAnalyzerService.name);

    constructor(
        private readonly geminiCliService: GeminiCliService,
        private readonly naverApiClientFactory: NaverApiClientFactory,
        private readonly keywordSettingService: KoreaInvestmentKeywordSettingService,
        private readonly koreaInvestmentQuotationClient: KoreaInvestmentQuotationClient,
    ) {}

    /**
     * Gemini를 통해 주식의 흐름을 분석합니다.
     * @param stockCode 종목 코드
     */
    public async requestAnalyzeStock(stockCode: string) {
        try {
            const keywords = await this.getKeywords(stockCode);
            const naverNewsItems = await this.getNaverNewsItems(keywords);
            const stockInvestors =
                await this.koreaInvestmentQuotationClient.inquireInvestor({
                    FID_INPUT_ISCD: stockCode,
                    FID_COND_MRKT_DIV_CODE: MarketDivCode.KRX,
                });

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
     * @param groupName
     */
    public async requestAnalyzeKeywordGroup(groupName: string) {
        try {
            const keywords =
                await this.keywordSettingService.getKeywordsByGroup(groupName);
            const naverNewsItems = await this.getNaverNewsItems(keywords);

            const transformer = new AnalyzeKeywordGroupPromptTransformer();
            this.geminiCliService.requestPrompt({
                callbackEvent: {
                    eventName:
                        StockAnalyzerEventType.AnalysisCompletedForKeywordGroup,
                    eventData: {
                        groupName,
                    },
                },
                prompt: transformer.transform({
                    groupName,
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
        const keywords: string[] =
            await this.keywordSettingService.getKeywordsByStockCode(stockCode);

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

        // 네이버 키워드 검색 - or 조건 적용
        const mergedKeyword = keywords.join(' | ');
        const client = this.naverApiClientFactory.create(NaverAppName.SEARCH);
        const newsResponses = await Promise.all(
            arr.map((page) =>
                client.getNews({
                    query: mergedKeyword,
                    start: page,
                    display: 100,
                    sort: 'date',
                }),
            ),
        );

        return newsResponses.flatMap((response) => response.items);
    }
}
