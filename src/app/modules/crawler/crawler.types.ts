export enum CrawlerFlowType {
    RequestDomesticNewsTitle = 'RequestDomesticNewsTitle',
    RequestDomesticHtsTopView = 'RequestDomesticHtsTopView',
    RequestDomesticVolumeRank = 'RequestDomesticVolumeRank',
    RequestRefreshPopulatedHtsTopView = 'RequestRefreshPopulatedHtsTopView',
    RequestRefreshPopulatedVolumeRank = 'RequestRefreshPopulatedVolumeRank',
}

export enum CrawlerQueueType {
    RequestKoreaInvestmentApi = 'RequestKoreaInvestmentApi',
}

export interface KoreaInvestmentCallApiParam<T = any> {
    url: string;
    tradeId: string;
    params: T;
}
