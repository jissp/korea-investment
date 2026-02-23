import { KeywordGroupNews, KeywordNews, News, StockNews } from './entities';

export enum NewsCategory {
    KoreaInvestment = 'KoreaInvestment',
    StockPlus = 'StockPlus',
    Naver = 'Naver',
    GoogleBusiness = 'GoogleBusiness',
}

export type NewsDto = Omit<News, 'id' | 'createdAt' | 'updatedAt'>;
export type KeywordNewsDto = Omit<
    KeywordNews,
    'id' | 'createdAt' | 'updatedAt'
>;
export type StockNewsDto = Omit<StockNews, 'id' | 'createdAt' | 'updatedAt'>;
export type KeywordGroupNewsDto = Omit<
    KeywordGroupNews,
    'id' | 'createdAt' | 'updatedAt'
>;
