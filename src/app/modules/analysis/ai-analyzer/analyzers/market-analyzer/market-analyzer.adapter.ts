import { FlowChildJob } from 'bullmq/dist/esm/interfaces/flow-job';
import { Injectable, Logger } from '@nestjs/common';
import { GeminiCliModel } from '@modules/gemini-cli';
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
import { IndexPromptTransformer } from './index-prompt.transformer';

interface MarketAnalysisData {
    newsItems: News[];
    marketIndices: MarketIndex[];
}

@Injectable()
export class MarketAnalyzerAdapter implements BaseAnalysisAdapter<MarketAnalysisData> {
    private readonly logger = new Logger(MarketAnalyzerAdapter.name);

    constructor(
        private readonly marketIndexService: MarketIndexService,
        private readonly newsService: NewsService,
        private readonly indexPromptTransformer: IndexPromptTransformer,
        private readonly newsPromptTransformer: NewsPromptTransformer,
    ) {}

    /**
     * 분석에 필요한 데이터를 수집합니다.
     */
    async collectData(): Promise<MarketAnalysisData> {
        const newsItems = await this.getNewsItems();
        const marketIndices = await this.marketIndexService.getIndicesByDays(7);

        return {
            newsItems,
            marketIndices,
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
    }: MarketAnalysisData): FlowChildJob {
        const queueName = MarketAnalyzerFlowType.Request;

        return {
            queueName,
            name: queueName,
            children: [
                {
                    queueName: AiAnalyzerQueueType.PromptToGeminiCli,
                    name: '최근 시장 지수 변동 분석',
                    data: {
                        prompt: this.indexPromptTransformer.transform({
                            marketIndices,
                        }),
                        model: GeminiCliModel.Gemini3Flash,
                    } as PromptToGeminiCliBody,
                },
                {
                    queueName: AiAnalyzerQueueType.PromptToGeminiCli,
                    name: '시장 최신 이슈 조회',
                    data: {
                        prompt: this.newsPromptTransformer.transform({
                            news: newsItems,
                        }),
                        model: GeminiCliModel.Gemini3Flash,
                    } as PromptToGeminiCliBody,
                },
            ],
        };
    }

    private async getNewsItems(limit: number = 100) {
        return this.newsService.getNewsListByCategory({
            category: NewsCategory.StockPlus,
            limit,
        });
    }
}
