import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    KeywordGroupNewsDto,
    KeywordNewsDto,
    NewsDto,
    StockNewsDto,
} from './news.types';
import { KeywordGroupNews, KeywordNews, News, StockNews } from './entities';

@Injectable()
export class NewsService {
    constructor(
        @InjectRepository(News)
        private readonly newsRepository: Repository<News>,
        @InjectRepository(StockNews)
        private readonly stockNewsRepository: Repository<StockNews>,
        @InjectRepository(KeywordNews)
        private readonly keywordNewsRepository: Repository<KeywordNews>,
        @InjectRepository(KeywordGroupNews)
        private readonly keywordGroupNewsRepository: Repository<KeywordGroupNews>,
    ) {}

    /**
     * 뉴스를 업데이트합니다.
     * @param newsDto
     */
    public async upsert(newsDto: NewsDto) {
        return this.newsRepository
            .createQueryBuilder()
            .insert()
            .into(News)
            .values(newsDto)
            .orUpdate(['title', 'description', 'published_at'], ['article_id'])
            .updateEntity(false)
            .execute();
    }

    /**
     * 키워드 뉴스를 업데이트합니다.
     * @param keywordNewsDto
     */
    public async upsertKeywordNews(keywordNewsDto: KeywordNewsDto) {
        return this.keywordNewsRepository
            .createQueryBuilder()
            .insert()
            .into(KeywordNews)
            .values(keywordNewsDto)
            .orUpdate(
                ['title', 'description', 'published_at'],
                ['keyword', 'article_id'],
            )
            .updateEntity(false)
            .execute();
    }

    /**
     * 키워드 그룹 뉴스를 업데이트합니다.
     * @param keywordGroupNewsDto
     */
    public async upsertKeywordGroupNews(
        keywordGroupNewsDto: KeywordGroupNewsDto,
    ) {
        return this.keywordGroupNewsRepository
            .createQueryBuilder()
            .insert()
            .into(KeywordGroupNews)
            .values(keywordGroupNewsDto)
            .orUpdate(
                ['title', 'description', 'published_at'],
                ['keyword_group_name', 'article_id'],
            )
            .updateEntity(false)
            .execute();
    }

    /**
     * 종목 뉴스를 업데이트합니다.
     * @param stockNewsDto
     */
    public async upsertStockNews(stockNewsDto: StockNewsDto) {
        return this.stockNewsRepository
            .createQueryBuilder()
            .insert()
            .into(StockNews)
            .values(stockNewsDto)
            .orUpdate(
                ['title', 'description', 'published_at'],
                ['stock_code', 'article_id'],
            )
            .updateEntity(false)
            .execute();
    }

    /**
     * 전체 뉴스의 최근 목록을 조회합니다.
     * @param limit
     */
    public async getNewsList({ limit = 100 }: { limit?: number }) {
        return this.newsRepository.find({
            order: {
                publishedAt: 'DESC',
            },
            take: limit,
        });
    }

    /**
     * 뉴스 목록을 조회합니다. (articleId 목록으로)
     * @param articleIds
     */
    public async getNewsListByArticleIds(
        articleIds: string[],
    ): Promise<News[]> {
        return this.newsRepository.find({
            where: {
                articleId: In(articleIds),
            },
            order: {
                publishedAt: 'DESC',
            },
        });
    }

    /**
     * 종목별 최근 뉴스 목록을 조회합니다.
     * @param keywordGroupName
     * @param limit
     */
    public async getStockNewsList({
        stockCode,
        limit = 100,
    }: {
        stockCode: string;
        limit?: number;
    }): Promise<StockNews[]> {
        return this.stockNewsRepository.find({
            where: {
                stockCode,
            },
            order: {
                publishedAt: 'DESC',
            },
            take: limit,
        });
    }

    /**
     * 키워드 그룹의 최근 뉴스 목록을 조회합니다.
     * @param keywordGroupName
     * @param limit
     */
    public async getKeywordGroupNewsList({
        keywordGroupName,
        limit = 100,
    }: {
        keywordGroupName: string;
        limit?: number;
    }): Promise<KeywordGroupNews[]> {
        return this.keywordGroupNewsRepository.find({
            where: {
                keywordGroupName,
            },
            order: {
                publishedAt: 'DESC',
            },
            take: limit,
        });
    }

    /**
     * 종목별 뉴스를 삭제합니다.
     * @param stockCode
     * @param articleId
     */
    public async deleteNewsByStockCode({
        stockCode,
        articleId,
    }: {
        stockCode: string;
        articleId?: string;
    }) {
        return this.stockNewsRepository.delete({
            stockCode,
            articleId,
        });
    }

    /**
     * 키워드별 뉴스를 삭제합니다.
     * @param stockCode
     * @param keyword
     */
    public async deleteNewsByKeyword({
        keyword,
        articleId,
    }: {
        keyword: string;
        articleId?: string;
    }) {
        return this.keywordNewsRepository.delete({
            keyword,
            articleId,
        });
    }

    /**
     * 키워드 그룹별 뉴스를 삭제합니다.
     * @param stockCode
     * @param keywordGroupName
     */
    public async deleteNewsByKeywordGroup({
        keywordGroupName,
        articleId,
    }: {
        keywordGroupName: string;
        articleId?: string;
    }) {
        return this.keywordGroupNewsRepository.delete({
            keywordGroupName,
            articleId,
        });
    }
}
