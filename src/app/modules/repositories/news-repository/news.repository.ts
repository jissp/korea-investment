import { Injectable, Logger } from '@nestjs/common';
import { RedisHelper, RedisSet, RedisZset } from '@modules/redis';
import { NewsItem, NewsRedisKey } from './news-repository.types';

@Injectable()
export class NewsRepository {
    private readonly logger = new Logger(NewsRepository.name);

    private readonly newsZSet: RedisZset<NewsItem>;
    private readonly newsSet: RedisSet;

    constructor(private readonly redisHelper: RedisHelper) {
        this.newsSet = redisHelper.createSet(NewsRedisKey.News, 'Set');
        this.newsZSet = redisHelper.createZSet<NewsItem>(NewsRedisKey.News);
    }

    /**
     * News를 추가합니다.
     * @param news
     */
    public async addNews(news: NewsItem): Promise<boolean> {
        try {
            if (await this.newsSet.exists(news.articleId)) {
                return true;
            }

            const timestamp = new Date(news.createdAt).getTime();
            const serializedNews = JSON.stringify(news);

            await this.newsSet.add(news.articleId);

            return this.newsZSet.add(serializedNews, timestamp);
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    /**
     * News 목록을 조회합니다.
     * @param limit
     */
    public async getNewsList(limit: number = 20) {
        return this.newsZSet.list(limit, {
            isParse: true,
        });
    }

    /**
     * 종목별 News를 추가합니다.
     * @param stockCode
     * @param news
     */
    public async addStockNews(stockCode: string, news: NewsItem) {
        const set = this.getNewsByStockCodeSet(stockCode);
        if (await set.exists(news.articleId)) {
            return;
        }

        await set.add(news.articleId);
        const zSet = this.getNewsByStockCodeZSet(stockCode);

        return zSet.add(
            JSON.stringify(news),
            new Date(news.createdAt).getTime(),
        );
    }

    /**
     * 종목별 News 목록을 조회합니다.
     * @param stockCode
     * @param limit
     */
    public async getStockNewsList(stockCode: string, limit: number = 20) {
        const zSet = this.getNewsByStockCodeZSet(stockCode);

        return zSet.list(limit, {
            isParse: true,
        });
    }

    /**
     * 키워드별 News를 추가합니다.
     * @param keyword
     * @param news
     */
    public async addKeywordNews(keyword: string, news: NewsItem) {
        const set = this.getNewsByKeywordSet(keyword);
        if (await set.exists(news.articleId)) {
            return;
        }

        await set.add(news.articleId);
        const zSet = this.getNewsByKeywordZSet(keyword);

        return zSet.add(
            JSON.stringify(news),
            new Date(news.createdAt).getTime(),
        );
    }

    /**
     * 키워드별 News 목록을 조회합니다.
     * @param keyword
     * @param limit
     */
    public async getKeywordNewsList(
        keyword: string,
        limit: number = 20,
    ): Promise<NewsItem[]> {
        const zSet = this.getNewsByKeywordZSet(keyword);

        return zSet.list(limit, {
            isParse: true,
        });
    }

    /**
     * 키워드 그룹별 News를 추가합니다.
     * @param groupName
     * @param news
     */
    public async addKeywordGroupNews(groupName: string, news: NewsItem) {
        const set = this.getNewsByKeywordGroupSet(groupName);
        if (await set.exists(news.articleId)) {
            return;
        }

        await set.add(news.articleId);
        const zSet = this.getNewsByKeywordGroupZSet(groupName);

        return zSet.add(
            JSON.stringify(news),
            new Date(news.createdAt).getTime(),
        );
    }

    /**
     * 키워드 그룹별 News 목록을 조회합니다.
     * @param groupName
     * @param limit
     */
    public async getKeywordGroupNewsList(
        groupName: string,
        limit: number = 20,
    ): Promise<NewsItem[]> {
        const zSet = this.getNewsByKeywordGroupZSet(groupName);

        return zSet.list(limit, {
            isParse: true,
        });
    }

    /**
     * 키워드별 News를 제거합니다.
     * @param keyword
     */
    public async deleteKeywordNews(keyword: string) {
        const set = this.getNewsByKeywordSet(keyword);
        const zSet = this.getNewsByKeywordZSet(keyword);

        return Promise.all([set.clear(), zSet.clear()]);
    }

    /**
     * 종목 코드별 News를 제거합니다.
     * @param stockCode
     */
    public async deleteNaverNewsByStockCode(stockCode: string) {
        const set = this.getNewsByStockCodeSet(stockCode);
        const zSet = this.getNewsByStockCodeZSet(stockCode);

        return Promise.all([set.clear(), zSet.clear()]);
    }

    /**
     * 키워드별 News의 Set을 생성합니다.
     * @param keyword
     * @private
     */
    private getNewsByKeywordSet(keyword: string) {
        return this.redisHelper.createSet(
            NewsRedisKey.NewsByKeyword,
            'Set',
            keyword,
        );
    }

    /**
     * 키워드별 News의 ZSet을 생성합니다.
     * @param keyword
     * @private
     */
    private getNewsByKeywordZSet(keyword: string) {
        return this.redisHelper.createZSet<NewsItem>(
            NewsRedisKey.NewsByKeyword,
            keyword,
        );
    }

    /**
     * 종목 코드별 News의 Set을 생성합니다.
     * @param stockCode
     * @private
     */
    private getNewsByStockCodeSet(stockCode: string) {
        return this.redisHelper.createSet(
            NewsRedisKey.NewsByStockCode,
            'Set',
            stockCode,
        );
    }

    /**
     * 종목 코드별 News의 ZSet을 생성합니다.
     * @param stockCode
     * @private
     */
    private getNewsByStockCodeZSet(stockCode: string) {
        return this.redisHelper.createZSet<NewsItem>(
            NewsRedisKey.NewsByStockCode,
            stockCode,
        );
    }

    /**
     * 키워드 그룹별 News의 Set을 생성합니다.
     * @param groupName
     * @private
     */
    private getNewsByKeywordGroupSet(groupName: string) {
        return this.redisHelper.createSet(
            NewsRedisKey.NewsByKeywordGroup,
            'Set',
            groupName,
        );
    }

    /**
     * 키워드 그룹별 News의 ZSet을 생성합니다.
     * @param groupName
     * @private
     */
    private getNewsByKeywordGroupZSet(groupName: string) {
        return this.redisHelper.createZSet<NewsItem>(
            NewsRedisKey.NewsByKeywordGroup,
            groupName,
        );
    }
}
