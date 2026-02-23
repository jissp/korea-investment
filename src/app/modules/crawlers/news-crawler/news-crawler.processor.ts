import { chunk } from 'lodash';
import { Repository } from 'typeorm';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OnQueueProcessor } from '@modules/queue';
import { News, NewsDto } from '@app/modules/repositories/news-repository';
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
        @InjectRepository(News)
        private readonly newsRepository: Repository<News>,
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
                await this.upsertBulkNews(batch);
            } catch (error) {
                this.logger.error(error);
            }
        }
    }

    /**
     * @param batch
     * @private
     */
    private upsertBulkNews(batch: NewsDto[]) {
        return this.newsRepository
            .createQueryBuilder()
            .insert()
            .into(News)
            .values(batch)
            .orUpdate(['title', 'description', 'published_at'], ['article_id'])
            .updateEntity(false)
            .execute();
    }
}
