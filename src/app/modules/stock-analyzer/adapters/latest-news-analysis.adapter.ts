import { Injectable, Logger } from '@nestjs/common';
import {
    News,
    NewsCategory,
    NewsService,
} from '@app/modules/repositories/news';
import { ReportType } from '@app/modules/repositories/ai-analysis-report';
import { IAnalysisAdapter } from './analysis-adapter.interface';
import { AnalysisCompletedEventBody } from '../stock-analyzer.types';
import { AnalyzeLatestNewsPromptTransformer } from '../transformers/analyze-latest-news-prompt.transformer';

interface LatestNewsAnalysisData {
    newsItems: News[];
}

@Injectable()
export class LatestNewsAnalysisAdapter implements IAnalysisAdapter<LatestNewsAnalysisData> {
    private readonly logger = new Logger(LatestNewsAnalysisAdapter.name);

    constructor(private readonly newsService: NewsService) {}

    /**
     * 분석에 필요한 데이터를 수집합니다.
     */
    async collectData(): Promise<LatestNewsAnalysisData> {
        const newsItems = await this.getNewsItems();

        return {
            newsItems,
        };
    }

    /**
     * 데이터를 프롬프트로 변환합니다.
     * @param data
     */
    transformToPrompt(data: LatestNewsAnalysisData): string {
        const transformer = new AnalyzeLatestNewsPromptTransformer();

        return transformer.transform({
            newsItems: data.newsItems,
        });
    }

    /**
     * 분석 완료 이벤트 객체를 생성합니다.
     * @param target
     * @param data
     */
    getEventConfig(
        target: string,
        data: LatestNewsAnalysisData,
    ): AnalysisCompletedEventBody {
        return {
            reportType: ReportType.LatestNews,
            reportTarget: ReportType.LatestNews,
            title: `최신 뉴스 동향 분석 리포트`,
        };
    }

    private async getNewsItems() {
        return this.newsService.getNewsListByCategory({
            category: NewsCategory.StockPlus,
            limit: 50,
        });
    }
}
