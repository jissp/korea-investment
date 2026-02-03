import { chunk } from 'lodash';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnQueueProcessor } from '@modules/queue';
import { NewsService } from '@app/modules/repositories/news';
import {
    NewsCrawlerQueueType,
    NewsStrategy,
    RequestCrawlingNewsJobPayload,
} from './news-crawler.types';
import { NewsCrawlerFactory } from './news-crawler.factory';

@Injectable()
export class NewsCrawlerProcessor {
    private readonly logger = new Logger(NewsCrawlerProcessor.name);

    constructor(
        private readonly factory: NewsCrawlerFactory,
        private readonly newsService: NewsService,
    ) {}

    @OnQueueProcessor(NewsCrawlerQueueType.RequestCrawlingNews)
    public async processNewsCrawling(
        job: Job<RequestCrawlingNewsJobPayload<NewsStrategy>>,
    ) {
        const newStrategy = this.factory.create(job);

        const dtoList = await newStrategy.run(job);
        if (!dtoList.length) {
            return;
        }

        // 배치 처리
        for (const batch of chunk(dtoList, 50)) {
            try {
                await this.newsService.upsert(batch);
            } catch (error) {
                this.logger.error(error);
            }
        }
    }
}
