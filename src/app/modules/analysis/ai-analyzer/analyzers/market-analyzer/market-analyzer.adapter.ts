import { FlowChildJob } from 'bullmq/dist/esm/interfaces/flow-job';
import { Injectable, Logger } from '@nestjs/common';
import { GeminiCliModel } from '@modules/gemini-cli';
import { MarketType } from '@app/common/types';
import {
    News,
    NewsCategory,
    NewsService,
} from '@app/modules/repositories/news';
import {
    MarketIndex,
    MarketIndexService,
} from '@app/modules/repositories/market-index';
import {
    AiAnalyzerQueueType,
    BaseAnalysisAdapter,
    NewsPromptTransformer,
    PromptToGeminiCliBody,
} from '@app/modules/analysis/ai-analyzer';
import { MarketAnalyzerFlowType } from './market-analyzer.types';
import { GlobalIndexTransformer, GlobalMacroTransformer } from './transformers';

interface MarketAnalysisData {
    newsItems: News[];
    marketIndices: MarketIndex[];
    overseasMarketIndices: MarketIndex[];
}

@Injectable()
export class MarketAnalyzerAdapter implements BaseAnalysisAdapter<MarketAnalysisData> {
    private readonly logger = new Logger(MarketAnalyzerAdapter.name);

    constructor(
        private readonly marketIndexService: MarketIndexService,
        private readonly newsService: NewsService,
        private readonly globalIndexTransformer: GlobalIndexTransformer,
        private readonly globalMacroTransformer: GlobalMacroTransformer,
        private readonly newsPromptTransformer: NewsPromptTransformer,
    ) {}

    /**
     * 분석에 필요한 데이터를 수집합니다.
     */
    async collectData(): Promise<MarketAnalysisData> {
        const newsItems = await this.getNewsItems();
        const marketIndices = await this.marketIndexService.getIndicesByDays(
            MarketType.Domestic,
            7,
        );
        const overseasMarketIndices =
            await this.marketIndexService.getIndicesByDays(
                MarketType.Overseas,
                7,
            );

        return {
            newsItems,
            marketIndices,
            overseasMarketIndices,
        };
    }

    public transformToTitle() {
        return `최신 뉴스 동향 분석`;
    }

    /**
     * 분석에 필요한 데이터를 FlowChildJob으로 변환합니다.
     * @param data
     */
    public transformToFlowChildJob({
        newsItems,
        marketIndices,
        overseasMarketIndices,
    }: MarketAnalysisData): FlowChildJob {
        const queueName = MarketAnalyzerFlowType.Request;

        return {
            queueName,
            name: queueName,
            children: [
                this.buildAssetChildJob(),
                this.buildMarketIndicesChildJob(marketIndices),
                this.buildMarketIndicesChildJob(overseasMarketIndices),
                this.buildMarketIssueChildJob(newsItems),
            ],
        };
    }

    /**
     * 시장 최신 이슈 ChildJob 생성
     * @param newsItems
     * @private
     */
    private buildMarketIssueChildJob(newsItems: News[]) {
        return {
            queueName: AiAnalyzerQueueType.PromptToGeminiCli,
            name: '시장 최신 이슈 조회',
            data: {
                prompt: this.newsPromptTransformer.transform({
                    news: newsItems,
                }),
                model: GeminiCliModel.Gemini3Flash,
            } as PromptToGeminiCliBody,
        };
    }

    /**
     * 핵심 자산 지수 ChildJob 생성
     * @private
     */
    private buildAssetChildJob(): FlowChildJob {
        return {
            queueName: AiAnalyzerQueueType.PromptToGeminiCli,
            name: '핵심 자산 지수 수집',
            data: {
                prompt: this.globalMacroTransformer.transform({
                    assets: [
                        '비트코인',
                        '금 현물',
                        '달러 인덱스',
                        '엔캐리',
                        '원화(환율)',
                    ],
                }),
                model: GeminiCliModel.Gemini3Pro,
            } as PromptToGeminiCliBody,
        };
    }

    /**
     * 최근 시장 지수 변동 분석 ChildJob 생성
     * @param marketIndices
     * @private
     */
    private buildMarketIndicesChildJob(
        marketIndices: MarketIndex[],
    ): FlowChildJob {
        // 일부는 제외
        const excludeMarketCodes = ['.DJI', 'Y0101', 'Y0105'];
        const filteredMarketIndices = marketIndices.filter(
            (marketIndex) => !excludeMarketCodes.includes(marketIndex.code),
        );

        return {
            queueName: AiAnalyzerQueueType.PromptToGeminiCli,
            name: '최근 시장 지수 변동 분석',
            data: {
                prompt: this.globalIndexTransformer.transform({
                    name: '주요 지수 분석',
                    marketIndices: filteredMarketIndices,
                }),
                model: GeminiCliModel.Gemini3Pro,
            } as PromptToGeminiCliBody,
        };
    }

    private async getNewsItems(limit: number = 100) {
        const stockPlusNewsItems = await this.getNewsItemsByStockPlus(limit);
        const googleBusinessNewsItems =
            await this.getNewsItemsByGoogleBusiness(limit);

        return [...stockPlusNewsItems, ...googleBusinessNewsItems].slice(
            0,
            limit,
        );
    }

    /**
     * StockPlus 최근 이슈 조회
     * @param limit
     * @private
     */
    private async getNewsItemsByStockPlus(limit: number = 100) {
        return this.newsService.getNewsListByCategory({
            category: NewsCategory.StockPlus,
            limit,
        });
    }

    /**
     * Google Business 최근 뉴스 조회
     * @param limit
     * @private
     */
    private async getNewsItemsByGoogleBusiness(limit: number = 100) {
        return this.newsService.getNewsListByCategory({
            category: NewsCategory.GoogleBusiness,
            limit,
        });
    }
}
