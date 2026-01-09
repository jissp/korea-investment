import { StockDailyInvestor } from '@app/modules/repositories/stock-daily-investor/stock-daily-investor.entity';

export type StockDailyInvestorDto = Omit<
    StockDailyInvestor,
    'id' | 'createdAt' | 'updatedAt'
>;
