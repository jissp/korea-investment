import {
    DomesticStockQuotationInquireIndexPriceOutput,
    DomesticStockQuotationsInquireDailyItemChartPriceOutput,
    DomesticStockQuotationsInquireDailyItemChartPriceOutput2,
    DomesticStockQuotationsIntstockMultPriceOutput,
    OverseasQuotationInquireDailyChartPriceOutput,
    OverseasQuotationInquireDailyChartPriceOutput2,
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
export type KoreaIndexItem = DomesticStockQuotationInquireIndexPriceOutput;
export type OverseasIndexItem = OverseasQuotationInquireDailyChartPriceOutput;
export type OverseasGovernmentBondItem = {
    output: OverseasQuotationInquireDailyChartPriceOutput;
    output2: OverseasQuotationInquireDailyChartPriceOutput2[];
};
