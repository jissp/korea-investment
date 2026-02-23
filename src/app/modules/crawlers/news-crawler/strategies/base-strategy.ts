import { Job } from 'bullmq';
import { NewsDto } from '@app/modules/repositories/news-repository';
import {
    NewsStrategy,
    RequestCrawlingNewsJobPayload,
} from '../news-crawler.types';

export abstract class BaseStrategy<T extends NewsStrategy, ResponseItem> {
    public async run(
        job: Job<RequestCrawlingNewsJobPayload<T>>,
    ): Promise<NewsDto[]> {
        const newsItems = await this.fetch(job);

        return newsItems.map((newsItem) => this.transform(newsItem));
    }

    protected abstract fetch(
        job: Job<RequestCrawlingNewsJobPayload<T>>,
    ): Promise<ResponseItem[]>;

    protected abstract transform(value: ResponseItem): NewsDto;
}
