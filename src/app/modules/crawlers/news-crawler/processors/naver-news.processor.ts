import * as _ from 'lodash';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnQueueProcessor } from '@modules/queue';
import {
    NaverApiClientFactory,
    NaverApiNewsItem,
    NaverAppName,
} from '@modules/naver/naver-api';
import {
    KeywordGroupService,
    KeywordService,
} from '@app/modules/repositories/keyword';
import { NewsDto, NewsService } from '@app/modules/repositories/news';
import {
    CrawlingNaverNewsJobPayload,
    NewsCrawlerQueueType,
} from '../news-crawler.types';
import { NaverNewsTransformer } from '../transformers/naver-news.transformer';

@Injectable()
export class NaverNewsProcessor {
    private readonly logger = new Logger(NaverNewsProcessor.name);
    private readonly transformer = new NaverNewsTransformer();

    constructor(
        private readonly naverApiClientFactory: NaverApiClientFactory,
        private readonly newsService: NewsService,
        private readonly keywordService: KeywordService,
        private readonly keywordGroupService: KeywordGroupService,
    ) {}

    @OnQueueProcessor(NewsCrawlerQueueType.CrawlingNaverNews)
    public async processCrawlingNaverNews(
        job: Job<CrawlingNaverNewsJobPayload>,
    ) {
        const { keywords } = job.data;

        const joinedKeyword = keywords.join(' | ');

        const client = this.naverApiClientFactory.create(NaverAppName.KEYWORD);
        const newsResponse = await client.getNews({
            query: joinedKeyword,
            start: 1,
            display: 100,
            sort: 'date',
        });

        await this.transformWithSave(newsResponse.items, keywords);
    }

    @OnQueueProcessor(NewsCrawlerQueueType.CrawlingNaverNewsForStockCode)
    public async processCrawlingNaverNewsForStockCode(
        job: Job<CrawlingNaverNewsJobPayload>,
    ) {
        const { keywords } = job.data;

        const joinedKeyword = keywords.join(' | ');

        const client = this.naverApiClientFactory.create(NaverAppName.NEWS);

        const newsResponse = await client.getNews({
            query: joinedKeyword,
            start: 1,
            display: 100,
            sort: 'date',
        });

        await this.transformWithSave(newsResponse.items, keywords);
    }

    /**
     *
     * @param newsItems
     * @param keywordNames
     * @private
     */
    private async transformWithSave(
        newsItems: NaverApiNewsItem[],
        keywordNames: string[],
    ) {
        for (const keywordName of keywordNames) {
            const keywordNews = newsItems.filter(
                ({ title, description }) =>
                    title.includes(keywordName) ||
                    description.includes(keywordName),
            );

            if (keywordNews.length === 0) {
                continue;
            }

            // const stockCodes =
            //     await this.keywordSettingService.getStockCodesByKeyword(
            //         keywordName,
            //     );
            // TODO 추후 종목 - 키워드 기능을 추가해야할 수 있음.
            const stockCodes = [];

            const keywordGroups =
                await this.extractKeywordGroupsByKeywordName(keywordName);

            const transformedNewsItems = this.transformNews(keywordNews);

            const chunks = _.chunk(transformedNewsItems, 10);
            for (const chunk of chunks) {
                await Promise.allSettled([
                    this.newsService.upsert(chunk),
                    ...chunk.flatMap((news) =>
                        stockCodes.map((stockCode) =>
                            this.newsService.upsertStockNews({
                                ...news,
                                stockCode,
                            }),
                        ),
                    ),
                    ...chunk.map((news) =>
                        this.newsService.upsertKeywordNews({
                            ...news,
                            keyword: keywordName,
                        }),
                    ),
                    ...chunk.flatMap((news) =>
                        keywordGroups.flatMap(({ name }) =>
                            this.newsService.upsertKeywordGroupNews({
                                ...news,
                                keywordGroupName: name,
                            }),
                        ),
                    ),
                ]);
            }
        }
    }

    /**
     * 키워드명을 가지고 있는 모든 키워드 그룹을 조회한다.
     * @param keywordName
     * @private
     */
    private async extractKeywordGroupsByKeywordName(keywordName: string) {
        const keywords =
            await this.keywordService.getKeywordsByName(keywordName);
        const keywordGroupIds = keywords
            .map(({ keywordGroupId }) => keywordGroupId)
            .filter(Boolean) as number[];

        return await this.keywordGroupService.getKeywordGroupByIds(
            keywordGroupIds,
        );
    }

    /**
     * Naver News API 응답을 News 모델로 변환합니다.
     * @param newsItems
     * @private
     */
    private transformNews(newsItems: NaverApiNewsItem[]): NewsDto[] {
        return newsItems.map((item) => this.transformer.transform(item));
    }
}
