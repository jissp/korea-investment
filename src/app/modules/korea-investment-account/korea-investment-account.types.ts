import {
    KoreaInvestmentAccountOutput2,
    KoreaInvestmentAccountStockOutput,
    KoreaInvestmentInterestGroupListOutput,
    KoreaInvestmentInterestStockListByGroupOutput2,
} from '@app/modules/korea-investment-request-api';

export enum KoreaInvestmentAccountKey {
    Accounts = 'Accounts',
    AccountInfo = 'Accounts:Info',
    AccountStocks = 'Accounts:Stocks',
    AccountStockGroups = 'Accounts:StockGroups',
    AccountStocksByGroup = 'Accounts:Stocks:Group',
}

export type AccountInfo = KoreaInvestmentAccountOutput2;

export type AccountStock = KoreaInvestmentAccountStockOutput;

export type AccountStockGroup = KoreaInvestmentInterestGroupListOutput;

export type AccountStockByGroup =
    KoreaInvestmentInterestStockListByGroupOutput2;
