import { chunk } from 'lodash';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { sleep, uniqueValues } from '@common/utils';
import {
    NaverApiClientFactory,
    NaverApiNewsItem,
    NaverAppName,
} from '@modules/naver/naver-api';
import { KeywordService } from '@app/modules/repositories/keyword';
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
export class NaverStrategy extends BaseStrategy<
    NewsStrategy.Naver,
    NaverApiNewsItem
> {
    private readonly logger = new Logger(NaverStrategy.name);

    constructor(
        private readonly naverApiClientFactory: NaverApiClientFactory,
        private readonly keywordService: KeywordService,
    ) {
        super();
    }

    protected async fetch(
        job: Job<RequestCrawlingNewsJobPayload<NewsStrategy.Naver>>,
    ): Promise<NaverApiNewsItem[]> {
        try {
            const keywords = await this.keywordService.getKeywords();
            if (!keywords.length) {
                return [];
            }

            const keywordNames = keywords.map((keyword) => keyword.name);
            const uniqKeywordNames = uniqueValues(keywordNames);

            const newsItems: NaverApiNewsItem[] = [];
            const client = this.naverApiClientFactory.create(
                NaverAppName.KEYWORD,
            );
            for (const keywordNameChunk of chunk(uniqKeywordNames, 6)) {
                try {
                    const response = await client.getNews({
                        query: keywordNameChunk.join(' | '),
                        start: 1,
                        display: 80,
                        sort: 'date',
                    });

                    newsItems.push(...response.items);
                } catch (error) {
                    this.logger.error(keywordNameChunk, error);
                } finally {
                    await sleep(250);
                }
            }

            return newsItems;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    public transform(value: NaverApiNewsItem): NewsDto {
        return {
            articleId: value.link,
            category: NewsCategory.Naver,
            title: value.title,
            description: value.description,
            link: value.link,
            publishedAt: new Date(value.pubDate),
        };
    }
}
