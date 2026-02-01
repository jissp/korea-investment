import { StockInvestor } from '@app/modules/repositories/stock-investor';

export interface StockExhaustionTraceData {
    stockCode: string;
    stockName: string;
    investors: StockInvestor[];
}
