export enum NewsCrawlerQueueType {
    CrawlingNaverNews = 'CrawlingNaverNews',
    CrawlingStockPlusNews = 'CrawlingStockPlusNews',
    RequestDomesticNewsTitle = 'RequestDomesticNewsTitle',
}

export interface RequestDomesticNewsTitleJobPayload {
    keyword: string;
}
