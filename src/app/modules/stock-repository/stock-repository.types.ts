import {
    DomesticStockQuotationsInquireDailyItemChartPriceOutput,
    DomesticStockQuotationsInquireDailyItemChartPriceOutput2,
    DomesticStockQuotationsIntstockMultPriceOutput,
} from '@modules/korea-investment/korea-investment-quotation-client';
import {
    DomesticStockQuotationVolumeRankOutput,
    DomesticStockRankingHtsTopViewOutput,
} from '@modules/korea-investment/korea-investment-rank-client';

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
