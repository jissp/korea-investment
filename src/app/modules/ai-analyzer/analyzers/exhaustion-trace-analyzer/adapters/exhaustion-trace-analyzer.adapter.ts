import { Injectable, Logger } from '@nestjs/common';
import { Stock } from '@app/modules/repositories/stock';
import {
    StockDailyInvestor,
    StockHourForeignerInvestor,
} from '@app/modules/repositories/stock-investor';
import { ExhaustionTraceAnalyzerHelper } from '../exhaustion-trace-analyzer-helper';
import { BaseExhaustionTraceAnalyzerAdapter } from '../base-exhaustion-trace-analyzer.adapter';

@Injectable()
export class ExhaustionTraceAnalyzerAdapter extends BaseExhaustionTraceAnalyzerAdapter {
    protected readonly logger = new Logger(ExhaustionTraceAnalyzerAdapter.name);

    constructor(exhaustionTraceAnalyzerHelper: ExhaustionTraceAnalyzerHelper) {
        super(exhaustionTraceAnalyzerHelper);
    }

    public transformToTitle() {
        return `종목 세력 추적 분석`;
    }

    protected async getStocks(): Promise<Stock[]> {
        const favoriteStocks =
            await this.exhaustionTraceAnalyzerHelper.getFavoriteStocks();

        const stockCodes = favoriteStocks.map(({ stockCode }) => stockCode);

        return this.exhaustionTraceAnalyzerHelper.getStocks(stockCodes);
    }

    protected getStockInvestors(
        stocks: Stock[],
    ): Promise<StockDailyInvestor[]> {
        return this.exhaustionTraceAnalyzerHelper.getStockInvestors(stocks);
    }

    protected getStockHourForeignerInvestors(
        stocks: Stock[],
    ): Promise<StockHourForeignerInvestor[]> {
        return this.exhaustionTraceAnalyzerHelper.getStockHourForeignerInvestorsByStocks(
            stocks,
        );
    }
}
