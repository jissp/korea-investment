import { NewsItem } from '@app/modules/repositories/news-repository/news-repository.types';

export type AllTypeNewsItem = {
    stockCode: string;
    stockName: string;
    news: NewsItem[];
};

export type KeywordNewsItem = {
    keyword: string;
    news: NewsItem[];
};
