import {
    type KoreaInvestmentAccountOutput2,
    type KoreaInvestmentAccountStockOutput,
} from '@app/modules/korea-investment-account-crawler';

export enum KoreaInvestmentAccountKey {
    Accounts = 'Accounts',
    AccountInfo = 'Accounts:Info',
    AccountStocks = 'Accounts:Stocks',
}

export type AccountInfo = KoreaInvestmentAccountOutput2;

export type AccountStock = KoreaInvestmentAccountStockOutput;
