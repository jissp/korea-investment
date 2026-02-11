import { Injectable, Logger } from '@nestjs/common';
import { uniqueValues } from '@common/utils';
import { getStockName } from '@common/domains';
import {
    News,
    NewsCategory,
    NewsService as NewsRepositoryService,
} from '@app/modules/repositories/news';
import { KeywordGroupService } from '@app/modules/repositories/keyword';
import { FavoriteStockService } from '@app/modules/repositories/favorite-stock';
import { NewsWithStock } from '@app/controllers/news/dto';

@Injectable()
export class NewsService {
    private readonly logger = new Logger(NewsService.name);

    constructor(
        private readonly keywordGroupService: KeywordGroupService,
        private readonly favoriteStockService: FavoriteStockService,
        private readonly newsService: NewsRepositoryService,
    ) {}

    /**
     * 모든 뉴스를 조회합니다.
     */
    public async getAllNews({
        limit = 100,
    }: {
        limit: number;
    }): Promise<News[]> {
        return this.newsService.getNewsList({ limit });
    }

    /**
     * 모든 키워드 그룹별 뉴스를 조회합니다.
     */
    public async getAllKeywordGroupNews(limit: number = 100) {
        const keywordGroups = await this.keywordGroupService.getKeywordGroups();

        return Promise.all(
            keywordGroups.map(async ({ name: keywordGroupName }) => {
                return {
                    keywordGroupName,
                    news: await this.newsService.getKeywordGroupNewsList({
                        keywordGroupName,
                        limit,
                    }),
                };
            }),
        );
    }

    /**
     * 키워드 그룹별 뉴스를 조회합니다.
     * @param keywordGroupName
     * @param limit
     */
    public async getKeywordGroupNews({
        keywordGroupName,
        limit = 100,
    }: {
        keywordGroupName: string;
        limit?: number;
    }) {
        return this.newsService.getKeywordGroupNewsList({
            keywordGroupName,
            limit,
        });
    }

    /**
     * 모든 종목의 뉴스를 조회합니다. (종목별 분류)
     */
    public async getAllTypeNews(): Promise<NewsWithStock[]> {
        const favoriteStocks = await this.favoriteStockService.findAll();
        const stockCodes = uniqueValues(
            favoriteStocks.map(({ stockCode }) => stockCode),
        );

        return Promise.all(
            stockCodes.map(async (stockCode) => {
                return {
                    stockCode,
                    stockName: getStockName(stockCode),
                    news: await this.newsService.getStockNewsList({
                        stockCode,
                        limit: 100,
                    }),
                };
            }),
        );
    }

    /**
     * 카테고리별 뉴스를 조회합니다.
     * @param category
     * @param limit
     */
    public async getNewsByCategory({
        category,
        limit = 100,
    }: {
        category: NewsCategory;
        limit?: number;
    }): Promise<News[]> {
        return this.newsService.getNewsListByCategories({
            categories: [category],
            limit,
        });
    }
}
