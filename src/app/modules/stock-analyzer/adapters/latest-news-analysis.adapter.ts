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
import { IAnalysisAdapter } from './analysis-adapter.interface';
import {
    PromptToGeminiCliBody,
    StockAnalyzerFlowType,
    StockAnalyzerQueueType,
} from '../stock-analyzer.types';
import { IndexPromptTransformer, NewsPromptTransformer } from '../transformers';

interface LatestNewsAnalysisData {
    newsItems: News[];
    marketIndices: MarketIndex[];
}

@Injectable()
export class LatestNewsAnalysisAdapter implements IAnalysisAdapter<LatestNewsAnalysisData> {
    private readonly logger = new Logger(LatestNewsAnalysisAdapter.name);

    constructor(
        private readonly marketIndexService: MarketIndexService,
        private readonly newsService: NewsService,
    ) {}

    /**
     * 분석에 필요한 데이터를 수집합니다.
     */
    async collectData(): Promise<LatestNewsAnalysisData> {
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
    }: LatestNewsAnalysisData): FlowChildJob {
        const queueName = StockAnalyzerFlowType.RequestLatestNews;

        return {
            queueName,
            name: queueName,
            children: [
                {
                    queueName: StockAnalyzerQueueType.PromptToGeminiCli,
                    name: '최근 시장 지수 변동 분석',
                    data: {
                        prompt: new IndexPromptTransformer().transform({
                            marketIndices,
                        }),
                        model: GeminiCliModel.Gemini3Pro,
                    } as PromptToGeminiCliBody,
                },
                {
                    queueName: StockAnalyzerQueueType.PromptToGeminiCli,
                    name: '시장 최신 이슈 조회',
                    data: {
                        prompt: new NewsPromptTransformer().transform({
                            news: newsItems,
                        }),
                        model: GeminiCliModel.Gemini3Pro,
                    } as PromptToGeminiCliBody,
                },
            ],
        };
    }

    private async getNewsItems() {
        return this.newsService.getNewsListByCategory({
            category: NewsCategory.StockPlus,
            limit: 50,
        });
    }
}
