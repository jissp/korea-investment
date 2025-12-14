import { StockPlusNews } from '@modules/stock-plus';
import {
    DomesticStockQuotationsIntstockMultPriceOutput,
    DomesticStockQuotationsNewsTitleOutput,
} from '@modules/korea-investment/korea-investment-quotation-client';
import {
    DomesticStockQuotationVolumeRankOutput,
    DomesticStockRankingHtsTopViewOutput,
} from '@modules/korea-investment/korea-investment-rank-client';

export type KoreaInvestmentNewsItem = DomesticStockQuotationsNewsTitleOutput;
export type StockPlusNewsItem = StockPlusNews;
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
