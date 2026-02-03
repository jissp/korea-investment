import { Job } from 'bullmq';
import { Inject, Injectable } from '@nestjs/common';
import {
    NewsCrawlerProvider,
    NewsStrategy,
    RequestCrawlingNewsJobPayload,
} from './news-crawler.types';
import { BaseStrategy } from './strategies';

@Injectable()
export class NewsCrawlerFactory {
    constructor(
        @Inject(NewsCrawlerProvider.StrategyMap)
        private readonly strategyMap: Map<
            NewsStrategy,
            BaseStrategy<NewsStrategy, unknown>
        >,
    ) {}

    public create<T extends NewsStrategy>(
        job: Job<RequestCrawlingNewsJobPayload<T>>,
    ): BaseStrategy<T, unknown> {
        const { strategy } = job.data;

        if (!this.strategyMap.has(strategy)) {
            throw new Error(`Unknown strategy: ${strategy}`);
        }

        return this.strategyMap.get(strategy)!;
    }
}
