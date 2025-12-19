import * as _ from 'lodash';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnQueueProcessor } from '@modules/queue';
import { NaverApiClient } from '@modules/naver';
import { KoreaInvestmentSettingService } from '@app/modules/korea-investment-setting';
import { NewsService } from '@app/modules/news';
import { NaverNewsCrawlerQueueType } from './naver-news-crawler.types';
import { NaverNewsToNewsTransformer } from './naver-news-to-news.transformer';

@Injectable()
export class NaverNewsCrawlerProcessor {
    private readonly logger = new Logger(NaverNewsCrawlerProcessor.name);
    private readonly transformer = new NaverNewsToNewsTransformer();

    constructor(
        private readonly client: NaverApiClient,
        private readonly koreaInvestmentSettingService: KoreaInvestmentSettingService,
        private readonly newsService: NewsService,
    ) {}

    @OnQueueProcessor(NaverNewsCrawlerQueueType.CrawlingNaverNews)
    public async processCrawlingNaverNews(job: Job) {
        const { keyword } = job.data;

        const stockCodes =
            await this.koreaInvestmentSettingService.getStockCodesFromKeyword(
                keyword,
            );

        const response = await this.client.getNews({
            query: keyword,
            start: 1,
            display: 100,
            sort: 'date',
        });

        const transformedNews = response.items.map(
            this.transformer.transform,
            this.transformer,
        );
        const newsScore = transformedNews.reduce(
            (previousValue, news) => {
                previousValue[news.articleId] = new Date(
                    news.createdAt,
                ).getTime();

                return previousValue;
            },
            {} as Record<string, number>,
        );
        const populatedNews = transformedNews.map((news) => ({
            ...news,
            stockCodes,
        }));

        const chunks = _.chunk(populatedNews, 10);
        for (const chunk of chunks) {
            await Promise.allSettled([
                ...chunk.map((news) => this.newsService.addNews(news)),
                ...chunk.map((news) =>
                    this.newsService.setKeywordNewsScore(
                        keyword,
                        news.articleId,
                        newsScore[news.articleId],
                    ),
                ),
                ...chunk.flatMap((news) =>
                    stockCodes.map((stockCode) =>
                        this.newsService.setStockNewsScore(
                            stockCode,
                            news.articleId,
                            newsScore[news.articleId],
                        ),
                    ),
                ),
            ]);
        }
    }
}
