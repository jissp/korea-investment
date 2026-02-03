import { DomesticStockQuotationsNewsTitleOutput } from '@modules/korea-investment/korea-investment-quotation-client';

export enum NewsCrawlerProvider {
    StrategyMap = 'StrategyMap',
}

export enum NewsCrawlerQueueType {
    RequestCrawlingNews = 'RequestCrawlingNews',
}

export enum NewsStrategy {
    Naver = 'Naver',
    KoreaInvestment = 'KoreaInvestment',
    StockPlus = 'StockPlus',
}

export interface NewsStrategyPayloadMap {
    [NewsStrategy.Naver]: void;
    [NewsStrategy.KoreaInvestment]: DomesticStockQuotationsNewsTitleOutput[];
    [NewsStrategy.StockPlus]: void;
}

export type BaseStrategyPayload<T extends NewsStrategy> =
    T extends keyof NewsStrategyPayloadMap ? NewsStrategyPayloadMap[T] : void;

export interface RequestCrawlingNewsJobPayload<T extends NewsStrategy> {
    strategy: T;
    payload: BaseStrategyPayload<T>;
}
