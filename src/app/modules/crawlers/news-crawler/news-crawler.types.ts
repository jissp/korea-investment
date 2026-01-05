export enum NewsCrawlerQueueType {
    CrawlingNaverNews = 'CrawlingNaverNews',
    CrawlingNaverNewsForStockCode = 'CrawlingNaverNewsForStockCode',
    CrawlingStockPlusNews = 'CrawlingStockPlusNews',
    RequestDomesticNewsTitle = 'RequestDomesticNewsTitle',
}

export interface CrawlingNaverNewsJobPayload {
    keyword: string;
}
