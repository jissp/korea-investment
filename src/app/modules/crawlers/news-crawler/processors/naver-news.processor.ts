import * as _ from 'lodash';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnQueueProcessor } from '@modules/queue';
import {
    NaverApiClientFactory,
    NaverApiNewsResponse,
    NaverAppName,
} from '@modules/naver/naver-api';
import { KoreaInvestmentKeywordSettingService } from '@app/modules/korea-investment-setting';
import {
    NewsItem,
    NewsRepository,
} from '@app/modules/repositories/news-repository';
import { NewsCrawlerQueueType } from '../news-crawler.types';
import { NaverNewsToNewsTransformer } from '../transformers/naver-news-to-news.transformer';

@Injectable()
export class NaverNewsProcessor {
    private readonly logger = new Logger(NaverNewsProcessor.name);
    private readonly transformer = new NaverNewsToNewsTransformer();

    constructor(
        private readonly naverApiClientFactory: NaverApiClientFactory,
        private readonly keywordSettingService: KoreaInvestmentKeywordSettingService,
        private readonly newsRepository: NewsRepository,
    ) {}

    @OnQueueProcessor(NewsCrawlerQueueType.CrawlingNaverNews)
    public async processCrawlingNaverNews(job: Job) {
        const { keyword } = job.data;

        const client = this.naverApiClientFactory.create(NaverAppName.KEYWORD);
        const response = await client.getNews({
            query: keyword,
            start: 1,
            display: 100,
            sort: 'date',
        });

        await this.transformWithSave(response, keyword);
    }

    @OnQueueProcessor(NewsCrawlerQueueType.CrawlingNaverNewsForStockCode)
    public async processCrawlingNaverNewsForStockCode(job: Job) {
        const { keyword } = job.data;

        const client = this.naverApiClientFactory.create(NaverAppName.NEWS);

        const response = await client.getNews({
            query: keyword,
            start: 1,
            display: 100,
            sort: 'date',
        });

        await this.transformWithSave(response, keyword);
    }

    /**
     *
     * @param response
     * @param keyword
     * @private
     */
    private async transformWithSave(
        response: NaverApiNewsResponse,
        keyword: string,
    ) {
        const stockCodes =
            await this.keywordSettingService.getStockCodesByKeyword(keyword);
        const keywordGroups =
            await this.keywordSettingService.getKeywordGroupsListByKeyword(
                keyword,
            );

        const transformedNewsItems = this.transformNews(response, stockCodes);

        const chunks = _.chunk(transformedNewsItems, 10);
        for (const chunk of chunks) {
            await Promise.allSettled([
                ...chunk.map((news) => this.newsRepository.addNews(news)),
                ...chunk.flatMap((news) =>
                    stockCodes.map((stockCode) =>
                        this.newsRepository.addStockNews(stockCode, news),
                    ),
                ),
                ...chunk.flatMap((news) =>
                    keywordGroups.flatMap((groupName) =>
                        this.newsRepository.addKeywordGroupNews(
                            groupName,
                            news,
                        ),
                    ),
                ),
            ]);
        }
    }

    /**
     * Naver News API 응답을 News 모델로 변환합니다.
     * @param response
     * @param stockCodes
     * @private
     */
    private transformNews(
        response: NaverApiNewsResponse,
        stockCodes: string[],
    ): NewsItem[] {
        const transformedNews = response.items.map((item) =>
            this.transformer.transform(item),
        );

        return transformedNews.map(
            (news): NewsItem => ({
                ...news,
                stockCodes,
            }),
        );
    }
}
