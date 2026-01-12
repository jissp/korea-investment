import { AccountStockGroup, AccountStockGroupStock } from './entities';

export type AccountStockGroupDto = Omit<
    AccountStockGroup,
    'id' | 'createdAt' | 'updatedAt'
>;
export type AccountStockGroupStockDto = Pick<
    AccountStockGroupStock,
    'groupCode' | 'stockCode' | 'stockName'
>;
export type UpdateAccountStockGroupStockDto = Pick<
    AccountStockGroupStock,
    'stockCode' | 'price' | 'changePrice' | 'changePriceRate'
>;
export type DeleteAccountStockGroupStockDto = Pick<
    AccountStockGroupStock,
    'groupCode' | 'stockCode'
>;
