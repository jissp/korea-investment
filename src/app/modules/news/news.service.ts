import * as _ from 'lodash';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RedisHash, RedisHelper, RedisZset } from '@modules/redis';
import { NewsEvent, NewsItem, NewsRedisKey } from './news.types';

@Injectable()
export class NewsService {
    private readonly logger = new Logger(NewsService.name);

    private readonly newsHash: RedisHash;
    private readonly newsScore: RedisZset;

    constructor(
        private readonly redisHelper: RedisHelper,
        private readonly eventEmitter: EventEmitter2,
    ) {
        this.newsHash = redisHelper.createHash(NewsRedisKey.News);
        this.newsScore = redisHelper.createZSet(NewsRedisKey.NewsScore);
    }

    /**
     * News를 추가합니다.
     * @param news
     */
    public async addNews(news: NewsItem) {
        try {
            const isAdded = await this.newsHash.add(
                news.articleId,
                JSON.stringify(news),
            );

            if (isAdded) {
                this.eventEmitter.emit(NewsEvent.AddedNews, news);
            }
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    /**
     * News 점수를 설정합니다.
     * @param newsId
     * @param score
     */
    public async setNewsScore(newsId: string, score: number) {
        return this.newsScore.add(newsId, score);
    }

    /**
     * News Id 목록을 조회합니다.
     * @param limit
     */
    public async getNewsIds(limit: number = 100) {
        return this.newsScore.list(limit);
    }

    /**
     * 종목별 News 점수를 설정합니다.
     * @param stockCode
     * @param newsId
     * @param score
     */
    public async setStockNewsScore(
        stockCode: string,
        newsId: string,
        score: number,
    ) {
        const zSet = this.getNewsByStockCodeZSet(stockCode);

        return zSet.add(newsId, score);
    }

    /**
     * 종목별 News Id 목록을 조회합니다.
     * @param stockCode
     * @param limit
     */
    public async getStockNewsScore(stockCode: string, limit: number = 100) {
        const zSet = this.getNewsByStockCodeZSet(stockCode);

        return zSet.list(limit);
    }

    /**
     * 키워드별 News 점수를 설정합니다.
     * @param keyword
     * @param newsId
     * @param score
     */
    public async setKeywordNewsScore(
        keyword: string,
        newsId: string,
        score: number,
    ) {
        const zSet = this.getNewsByKeywordZSet(keyword);

        return zSet.add(newsId, score);
    }

    /**
     * 키워드별 News Id 목록을 조회합니다.
     * @param keyword
     * @param limit
     */
    public async getKeywordNewsScore(keyword: string, limit: number = 100) {
        const zSet = this.getNewsByKeywordZSet(keyword);

        return zSet.list(limit);
    }

    /**
     * News 데이터를 Populate하여 응답합니다.
     * @param newsIds
     */
    public async populateNews(newsIds: string[]) {
        if (newsIds.length === 0) {
            return [];
        }

        const encodedNews = await this.newsHash.mget(newsIds);
        const filteredEncodedNews = encodedNews.filter(Boolean) as string[];
        if (filteredEncodedNews.length === 0) {
            return [];
        }

        const news = filteredEncodedNews.map((news) =>
            JSON.parse(news),
        ) as NewsItem[];
        const newsMap = _.keyBy(news, 'articleId');

        return newsIds.map((newsId) => newsMap[newsId]);
    }

    /**
     * 키워드 네이버 News 점수를 제거합니다.
     * @param keyword
     */
    public async deleteKeywordNews(keyword: string) {
        const zSet = this.getNewsByKeywordZSet(keyword);

        return zSet.clear();
    }

    /**
     * 종목 코드별 네이버 News 점수를 제거합니다.
     * @param stockCode
     */
    public async deleteNaverNewsByStockCode(stockCode: string) {
        const zSet = this.getNewsByStockCodeZSet(stockCode);

        return zSet.clear();
    }

    /**
     * 키워드별 News의 ZSet을 생성합니다.
     * @param keyword
     * @private
     */
    private getNewsByKeywordZSet(keyword: string) {
        return this.redisHelper.createZSet(NewsRedisKey.NewsByKeyword, keyword);
    }

    /**
     * 종목 코드별 News의 ZSet을 생성합니다.
     * @param stockCode
     * @private
     */
    private getNewsByStockCodeZSet(stockCode: string) {
        return this.redisHelper.createZSet(
            NewsRedisKey.NewsByStockCode,
            stockCode,
        );
    }
}
