import { IConfiguration } from '@app/configuration';

export type StockPlusConfigs = IConfiguration['stockPlus'];

export type StockPlusResponse<T> = {
    data: T;
    message: string;
    status: string;
};

export type StockPlusNewsResponse = {
    breakingNews: StockPlusNews[];
};

export type StockPlusNews = {
    id: number;
    title: string;
    importance: 'GENERAL' | 'MAJOR';
    publishedAt: number;
    relatedNewsCount: number;
    summaries: string[];
    assets: StockPlusAsset[];
};

export type StockPlusAsset = {
    assetCode: string;
    displayName: string;
};
