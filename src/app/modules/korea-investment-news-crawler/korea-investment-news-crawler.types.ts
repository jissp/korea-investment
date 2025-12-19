import { DomesticStockQuotationsNewsTitleOutput } from '@modules/korea-investment/korea-investment-quotation-client';

export enum KoreaInvestmentNewsCrawlerType {
    RequestDomesticNewsTitle = 'RequestDomesticNewsTitle',
}

export type KoreaInvestmentNewsItem = DomesticStockQuotationsNewsTitleOutput;

export type RequestDomesticNewsTitleResponse = KoreaInvestmentNewsItem[];
