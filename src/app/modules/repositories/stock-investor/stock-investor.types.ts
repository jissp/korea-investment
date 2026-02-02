import { StockInvestor } from './stock-investor.entity';

export type StockInvestorDto = Omit<
    StockInvestor,
    'id' | 'createdAt' | 'updatedAt'
>;
