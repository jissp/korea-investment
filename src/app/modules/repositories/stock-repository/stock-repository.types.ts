import {
    DomesticStockQuotationsInquireDailyItemChartPriceOutput,
    DomesticStockQuotationsInquireDailyItemChartPriceOutput2,
    DomesticStockQuotationsIntstockMultPriceOutput,
} from '@modules/korea-investment/korea-investment-quotation-client';
import {
    DomesticStockQuotationVolumeRankOutput,
    DomesticStockRankingHtsTopViewOutput,
} from '@modules/korea-investment/korea-investment-rank-client';

export enum StockRepositoryRedisKey {
    Stocks = 'stocks',
    KoreaInvestmentHtsTopView = 'KoreaInvestmentHtsTopView',
    KoreaInvestmentVolumeRank = 'KoreaInvestmentVolumeRank',
    KoreaInvestmentPopulatedHtsTopView = 'KoreaInvestmentPopulatedHtsTopView',
    KoreaInvestmentPopulatedVolumeRank = 'KoreaInvestmentPopulatedVolumeRank',
    DailyStockChart = 'DailyStockChart',
}

export type KoreaInvestmentVolumeRankItem =
    DomesticStockQuotationVolumeRankOutput;
export type KoreaInvestmentHtsTopViewItem =
    DomesticStockRankingHtsTopViewOutput;
export type KoreaInvestmentPopulatedHtsTopViewItem = {
    htsTopView: KoreaInvestmentHtsTopViewItem;
    stockPrice: DomesticStockQuotationsIntstockMultPriceOutput;
};
export type KoreaInvestmentPopulatedVolumeRankItem = {
    volumeRank: KoreaInvestmentVolumeRankItem;
    stockPrice: DomesticStockQuotationsIntstockMultPriceOutput;
};
export type KoreaInvestmentDailyItemChartPrice = {
    output: DomesticStockQuotationsInquireDailyItemChartPriceOutput;
    output2: DomesticStockQuotationsInquireDailyItemChartPriceOutput2[];
};

export type KoreaInvestmentStockInvestor = {
    /**
     * 주식 영업 일자 (YYYY-MM-DD)
     */
    date: string;

    /**
     * 주식 종가
     */
    stockPrice: number;

    /**
     * 개인 순매수 수량
     */
    prsnQuantity: number;

    /**
     * 외국인 순매수 수량
     */
    frgnQuantity: number;

    /**
     * 기관계 순매수 수량
     */
    orgnQuantity: number;
};
