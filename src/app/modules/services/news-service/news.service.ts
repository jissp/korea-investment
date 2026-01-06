import { Injectable, Logger } from '@nestjs/common';
import { getStockName } from '@common/domains';
import {
    filterFulfilledPromiseValues,
    filterRejectedPromises,
} from '@common/utils';
import {
    KeywordType,
    KoreaInvestmentKeywordSettingService,
    KoreaInvestmentSettingService,
} from '@app/modules/korea-investment-setting';
import { NewsRepository } from '@app/modules/repositories/news-repository';
import {
    AllTypeNewsItem,
    KeywordGroupNewsItem,
    KeywordNewsItem,
} from './news-service.types';

@Injectable()
export class NewsService {
    private readonly logger = new Logger(NewsService.name);

    constructor(
        private readonly settingService: KoreaInvestmentSettingService,
        private readonly keywordSettingService: KoreaInvestmentKeywordSettingService,
        private readonly newsRepository: NewsRepository,
    ) {}

    /**
     * 모든 뉴스를 조회합니다.
     */
    public async getAllNews({ limit = 100 }: { limit: number }) {
        return this.newsRepository.getNewsList(limit);
    }

    /**
     * 키워드별 뉴스를 조회합니다.
     */
    public async getAllKeywordNews(): Promise<KeywordNewsItem[]> {
        const keywords = await this.keywordSettingService.getKeywordsByType(
            KeywordType.Manual,
        );

        const results = await Promise.allSettled(
            keywords.map(async (keyword) => {
                return {
                    keyword,
                    news: await this.newsRepository.getKeywordNewsList(keyword),
                };
            }),
        );

        const rejectedResults = filterRejectedPromises(results);
        if (rejectedResults.length) {
            rejectedResults.forEach((rejectedResult) => {
                this.logger.error(rejectedResult.reason);
            });
        }

        return filterFulfilledPromiseValues(results);
    }

    /**
     * 모든 키워드 그룹별 뉴스를 조회합니다.
     */
    public async getAllKeywordGroupNews(): Promise<KeywordGroupNewsItem[]> {
        const keywordGroupNames =
            await this.keywordSettingService.getKeywordGroupsList();

        const newsResults = await Promise.all(
            keywordGroupNames.map(async (keywordGroupName) => {
                return {
                    groupName: keywordGroupName,
                    news: await this.newsRepository.getKeywordGroupNewsList(
                        keywordGroupName,
                        100,
                    ),
                };
            }),
        );

        return newsResults.map(({ groupName, news }) => ({
            groupName,
            news,
        }));
    }

    /**
     * 키워드 그룹별 뉴스를 조회합니다.
     * @param groupName
     */
    public async getKeywordGroupNews(
        groupName: string,
    ): Promise<KeywordGroupNewsItem> {
        const news = await this.newsRepository.getKeywordGroupNewsList(
            groupName,
            100,
        );

        return {
            groupName,
            news,
        };
    }

    /**
     * 모든 종목의 뉴스를 조회합니다. (종목별 분류)
     */
    public async getAllTypeNews(): Promise<AllTypeNewsItem[]> {
        const stockCodes = await this.settingService.getStockCodes();

        const results = await Promise.allSettled(
            stockCodes.map(async (stockCode) => {
                return {
                    stockCode,
                    stockName: getStockName(stockCode),
                    news: await this.newsRepository.getStockNewsList(stockCode),
                };
            }),
        );

        return filterFulfilledPromiseValues(results);
    }
}
