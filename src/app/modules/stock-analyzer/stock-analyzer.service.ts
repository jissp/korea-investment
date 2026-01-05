import * as _ from 'lodash';
import { Injectable, Logger } from '@nestjs/common';
import { getStockName } from '@common/domains';
import { GeminiCliService } from '@modules/gemini-cli';
import {
    NaverApiClientFactory,
    NaverApiNewsItem,
    NaverApiNewsResponse,
    NaverAppName,
} from '@modules/naver/naver-api';
import { StockAnalyzerEventType } from './stock-analyzer.types';
import { KoreaInvestmentKeywordSettingService } from '@app/modules/korea-investment-setting';

const MAX_NEWS_ITEMS = 30;

@Injectable()
export class StockAnalyzerService {
    private readonly logger = new Logger(StockAnalyzerService.name);

    constructor(
        private readonly geminiCliService: GeminiCliService,
        private readonly naverApiClientFactory: NaverApiClientFactory,
        private readonly keywordSettingService: KoreaInvestmentKeywordSettingService,
    ) {}

    /**
     * Gemini를 통해 주식의 흐름을 분석합니다.
     * @param stockCode 종목 코드
     */
    public async requestAnalyzeStock(stockCode: string) {
        try {
            const keywords = await this.getKeywords(stockCode);

            const client = this.naverApiClientFactory.create(
                NaverAppName.SEARCH,
            );

            const newsResponses = await Promise.all(
                keywords.map((keyword) =>
                    client.getNews({
                        query: keyword,
                    }),
                ),
            );

            const newsItems = this.extractNewsItems(newsResponses);

            const newsPrompt = this.buildNewsPrompt(
                newsItems.slice(0, MAX_NEWS_ITEMS),
            );

            this.geminiCliService.requestPrompt({
                callbackEvent: {
                    eventName: StockAnalyzerEventType.AnalysisCompleted,
                    eventData: {
                        stockCode,
                    },
                },
                prompt: this.buildPromptForAnalysisStock({
                    stockName: getStockName(stockCode),
                    newsPrompt,
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
    private async getKeywords(stockCode: string) {
        const keywords =
            await this.keywordSettingService.getKeywordsByStockCode(stockCode);

        return Array.from(new Set([getStockName(stockCode), ...keywords]));
    }

    /**
     * 실시간으로 검색된 뉴스 정보를 추출합니다.
     * @param newsResponses
     * @private
     */
    private extractNewsItems(newsResponses: NaverApiNewsResponse[]) {
        const newsItems = newsResponses.flatMap(({ items }) => items);
        if (newsItems.length === 0) {
            throw new Error('실시간으로 검색된 뉴스 정보가 없습니다.');
        }

        return _.sortBy(newsItems, (newsItem) =>
            new Date(newsItem.pubDate).getTime(),
        ).reverse();
    }

    /**
     * 뉴스 정보를 문자열로 변환합니다.
     * @private
     * @param newsItems
     */
    private buildNewsPrompt(newsItems: NaverApiNewsItem[]): string {
        return newsItems
            .map((newsItem) => {
                return `- 제목: ${newsItem.title}, 내용: ${newsItem.description}, 링크: ${newsItem.link}`;
            })
            .join('\n');
    }

    /**
     * 주식 정보를 분석하는 프롬프트를 생성합니다.
     * @param stockName
     * @param newsPrompt
     * @private
     */
    private buildPromptForAnalysisStock({
        stockName,
        newsPrompt,
    }: {
        stockName: string;
        newsPrompt: string;
    }) {
        return `당신은 뉴스 정보를 통해 주가의 흐름을 분석하고 예측하는 전문 주식 분석가이자 투자자입니다.
아래 지침을 따라 "${stockName}" 종목에 대해 분석하세요.

# 지침
1. 제공된 뉴스 정보를 분석합니다.
${newsPrompt}
2. 분석한 뉴스 정보를 통해 주가 흐름을 예측하고 분석하세요.
3. 추가로 참고하면 좋을 정보들을 제공하세요.
- 관련 주제, 테마, 섹터 등 주가에 영향을 줄만한 최신 정보면 좋습니다.
4. 분석 결과는 반드시 분석 결과 응답 형식으로 답변하세요.
5. 분석 결과는 핵심만 간결하게 작성하세요.

# 분석 결과 응답 형식
## 최근 주식 동향
[설명]

## 주가 전망
- **상방 요인**: [상방 요인 설명]
- **하방 요인**: [하방 요인 설명]

## 추가로 참고하면 좋을 정보
[정보]

## 연관 주식 종목 목록
- **[종목명]**: [사유]
- ...

## 핵심 키워드
- **[키워드명]**: [사유]
- ...

## 추천하는 포지션과 사유
- **[포지션]**
- [사유]
`;
    }
}
