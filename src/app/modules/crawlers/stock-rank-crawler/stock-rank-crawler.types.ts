import { ExchangeType } from '@app/common/types';

export enum StockRankCrawlerFlowType {
    RequestHtsTopViews = 'RequestHtsTopViews',
    RequestPopulatedHtsTopView = 'RequestPopulatedHtsTopView',
    RequestVolumeRanks = 'RequestVolumeRanks',
}

export interface HtsTopView {
    stockCode: string;
    exchangeType: ExchangeType;
}
