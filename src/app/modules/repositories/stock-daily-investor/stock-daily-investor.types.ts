import { StockDailyInvestor } from './stock-daily-investor.entity';

export type StockDailyInvestorDto = Omit<
    StockDailyInvestor,
    'id' | 'createdAt' | 'updatedAt'
>;
