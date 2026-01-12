import { AccountStockGroup, AccountStockGroupStock } from './entities';

export type AccountStockGroupDto = Omit<
    AccountStockGroup,
    'id' | 'createdAt' | 'updatedAt'
>;
export type AccountStockGroupStockDto = Pick<
    AccountStockGroupStock,
    'groupCode' | 'stockCode' | 'stockName'
>;
export type UpdateAccountStockGroupStockDto = Omit<
    AccountStockGroupStock,
    'id' | 'groupCode' | 'stockName' | 'createdAt' | 'updatedAt'
>;
export type DeleteAccountStockGroupStockDto = Pick<
    AccountStockGroupStock,
    'groupCode' | 'stockCode'
>;
