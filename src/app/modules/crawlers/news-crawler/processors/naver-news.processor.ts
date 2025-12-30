import * as _ from 'lodash';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnQueueProcessor } from '@modules/queue';
import { NaverApiClient } from '@modules/naver';
import { KoreaInvestmentKeywordSettingService } from '@app/modules/korea-investment-setting';
import { NewsService } from '@app/modules/news';
import { NewsCrawlerQueueType } from '../news-crawler.types';
import { NaverNewsToNewsTransformer } from '../transformers/naver-news-to-news.transformer';

@Injectable()
export class NaverNewsProcessor {
    private readonly logger = new Logger(NaverNewsProcessor.name);
    private readonly transformer = new NaverNewsToNewsTransformer();

    constructor(
        private readonly client: NaverApiClient,
        private readonly keywordSettingService: KoreaInvestmentKeywordSettingService,
        private readonly newsService: NewsService,
    ) {}

    @OnQueueProcessor(NewsCrawlerQueueType.CrawlingNaverNews)
    public async processCrawlingNaverNews(job: Job) {
        const { keyword } = job.data;

        const stockCodes =
            await this.keywordSettingService.getStockCodesFromKeyword(keyword);

        const response = await this.client.getNews({
            query: keyword,
            start: 1,
            display: 100,
            sort: 'date',
        });

        const transformedNews = response.items.map((item) =>
            this.transformer.transform(item),
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
                    this.newsService.addKeywordNews(keyword, news),
                ),
                ...chunk.flatMap((news) =>
                    stockCodes.map((stockCode) =>
                        this.newsService.addStockNews(stockCode, news),
                    ),
                ),
            ]);
        }
    }
}
