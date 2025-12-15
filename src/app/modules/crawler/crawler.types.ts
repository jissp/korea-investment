export enum CrawlerFlowType {
    RequestDomesticNewsTitle = 'RequestDomesticNewsTitle',
    RequestDomesticHtsTopView = 'RequestDomesticHtsTopView',
    RequestDomesticVolumeRank = 'RequestDomesticVolumeRank',
    RequestDailyItemChartPrice = 'RequestDailyItemChartPrice',
    RequestRefreshPopulatedHtsTopView = 'RequestRefreshPopulatedHtsTopView',
    RequestRefreshPopulatedVolumeRank = 'RequestRefreshPopulatedVolumeRank',
    RequestKoreaIndex = 'RequestKoreaIndex',
    RequestOverseasIndex = 'RequestOverseasIndex',
}

export enum CrawlerQueueType {
    RequestKoreaInvestmentApi = 'RequestKoreaInvestmentApi',
}

export interface KoreaInvestmentCallApiParam<T = any> {
    url: string;
    tradeId: string;
    params: T;
}
