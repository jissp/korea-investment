import { Account, AccountStock } from './entities';

export type AccountDto = Omit<Account, 'id' | 'createdAt' | 'updatedAt'>;
export type AccountInfoDto = Omit<
    Account,
    'id' | 'accountId' | 'createdAt' | 'updatedAt'
>;
export type AccountStockDto = Omit<
    AccountStock,
    'id' | 'createdAt' | 'updatedAt'
>;
