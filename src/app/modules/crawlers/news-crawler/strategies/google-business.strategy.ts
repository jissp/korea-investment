import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { removeTag } from '@common/utils';
import { GoogleRssItem, GoogleRssService } from '@modules/google-rss';
import {
    NewsCategory,
    NewsDto,
} from '@app/modules/repositories/news-repository';
import {
    NewsStrategy,
    RequestCrawlingNewsJobPayload,
} from '../news-crawler.types';
import { BaseStrategy } from './base-strategy';

@Injectable()
export class GoogleBusinessStrategy extends BaseStrategy<
    NewsStrategy.GoogleBusiness,
    GoogleRssItem
> {
    private readonly logger = new Logger(GoogleBusinessStrategy.name);

    constructor(private readonly googleRssService: GoogleRssService) {
        super();
    }

    protected async fetch(
        job: Job<RequestCrawlingNewsJobPayload<NewsStrategy.GoogleBusiness>>,
    ): Promise<GoogleRssItem[]> {
        return await this.googleRssService.getBusinessNews();
    }

    protected transform(value: GoogleRssItem): NewsDto {
        return {
            articleId: value.guid['#text'],
            category: NewsCategory.GoogleBusiness,
            title: value.title,
            description: removeTag(value.description ?? ''),
            link: value.link,
            publishedAt: new Date(value.pubDate),
        };
    }
}
