import {
    KoreaInvestmentAccountOutput2,
    KoreaInvestmentAccountStockOutput,
    KoreaInvestmentInterestGroupListOutput,
    KoreaInvestmentInterestStockListByGroupOutput2,
} from '@app/modules/korea-investment-request-api';

export enum KoreaInvestmentAccountKey {
    AccountInfo = 'accounts',
    AccountStocks = 'accounts:stocks',
    AccountStockGroups = 'accounts:stock-groups',
    AccountStocksByGroup = 'accounts:stocks:by-group',
}

export type AccountInfo = KoreaInvestmentAccountOutput2;

export type AccountStock = KoreaInvestmentAccountStockOutput;

export type AccountStockGroup = KoreaInvestmentInterestGroupListOutput;

export type AccountStockByGroup =
    KoreaInvestmentInterestStockListByGroupOutput2;
