import { StockDailyInvestor, StockHourForeignerInvestor } from './entities';

export type StockDailyInvestorDto = Omit<
    StockDailyInvestor,
    'id' | 'createdAt' | 'updatedAt'
>;

export type StockHourForeignerInvestorDto = Omit<
    StockHourForeignerInvestor,
    'id' | 'createdAt' | 'updatedAt'
>;
