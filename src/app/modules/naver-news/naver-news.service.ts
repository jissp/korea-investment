import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { RedisHash, RedisHelper, RedisZset } from '@modules/redis';
import { NaverApiNewsItem } from '@modules/naver';

enum RedisKey {
    NaverNews = 'Naver:News',
    NaverStockNews = 'Naver:News:StockCode',
    NaverKeywordNews = 'Naver:News:Keyword',
}

@Injectable()
export class NaverNewsService {
    private hash: RedisHash;
    private newsZset: RedisZset;

    constructor(private readonly redisHelper: RedisHelper) {
        // 아래는 일반 뉴스 저장을 위한 Hash, ZSet 입니다.
        this.hash = this.redisHelper.createHash(RedisKey.NaverNews);
        this.newsZset = this.redisHelper.createZSet(RedisKey.NaverStockNews);
    }

    /**
     * 네이버 NewsIds를 기반으로 실제 News 데이터를 Populate 합니다.
     * @param newsIds
     */
    public async populateNews(newsIds: string[]) {
        if (newsIds.length === 0) {
            return [];
        }

        const encodedNews = await this.hash.mget(newsIds);
        const filteredEncodedNews = encodedNews.filter(Boolean) as string[];

        const news = filteredEncodedNews.map((news) =>
            JSON.parse(news),
        ) as NaverApiNewsItem[];
        const newsMap = _.keyBy(news, 'link');

        return newsIds.map((newsId) => newsMap[newsId]);
    }

    /**
     * 네이버 News를 저장합니다.
     * @param newsId
     * @param news
     */
    public async setNews(newsId: string, news: NaverApiNewsItem) {
        return this.hash.add(newsId, JSON.stringify(news));
    }

    /**
     * 네이버 News의 점수를 설정합니다.
     * @param newsId
     * @param score
     */
    public async setNewsScore(newsId: string, score: number) {
        return this.newsZset.add(newsId, score);
    }

    /**
     * 네이버 News 목록을 조회합니다.
     */
    public async getNewsIds() {
        return this.newsZset.list();
    }

    /**
     * 주식 종목별 네이버 News 목록을 조회합니다.
     * @param stockCode
     */
    public async getStockNewsIdsByStockCode(stockCode: string) {
        const zSet = this.getNaverNewsSet(stockCode);

        return zSet.list();
    }

    /**
     * 주식 종목별 네이버 News 점수를 설정합니다.
     * @param stockCode
     * @param newsId
     * @param score
     */
    public async setStockNewsScore(
        stockCode: string,
        newsId: string,
        score: number,
    ) {
        const zSet = this.getNaverNewsSet(stockCode);

        return zSet.add(newsId, score);
    }

    /**
     * 키워드별 네이버 News 목록을 조회합니다.
     * @param keyword
     */
    public async getNaverNewsIdsByKeyword(keyword: string) {
        const zSet = this.getNaverKeywordNewsSet(keyword);

        return zSet.list();
    }

    /**
     * 키워드별 네이버 News 점수를 설정합니다.
     * @param keyword
     * @param newsId
     * @param score
     */
    public async setKeywordNewsScore(
        keyword: string,
        newsId: string,
        score: number,
    ) {
        const zSet = this.getNaverKeywordNewsSet(keyword);

        return zSet.add(newsId, score);
    }

    /**
     * 키워드별 네이버 News 점수를 설정합니다.
     * @param keyword
     */
    public async deleteKeywordNews(keyword: string) {
        const zSet = this.getNaverKeywordNewsSet(keyword);

        return zSet.clear();
    }

    /**
     * @param stockCode
     */
    public async deleteNaverNewsByStockCode(stockCode: string) {
        const zSet = this.getNaverNewsSet(stockCode);

        return zSet.clear();
    }

    /**
     * NaverNews RedisSet을 생성합니다.
     * @param stockCode
     * @private
     */
    private getNaverNewsSet(stockCode: string) {
        return this.redisHelper.createZSet(RedisKey.NaverStockNews, stockCode);
    }

    /**
     * NaverKeywordNews RedisSet을 생성합니다.
     * @param keyword
     * @private
     */
    private getNaverKeywordNewsSet(keyword: string) {
        return this.redisHelper.createZSet(RedisKey.NaverKeywordNews, keyword);
    }
}
