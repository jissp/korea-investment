import { Injectable, Logger } from '@nestjs/common';
import { Stock } from '@app/modules/repositories/stock';
import {
    StockDailyInvestor,
    StockHourForeignerInvestor,
} from '@app/modules/repositories/stock-investor';
import { BaseExhaustionTraceAnalyzerAdapter } from '../base-exhaustion-trace-analyzer.adapter';
import { ExhaustionTraceAnalyzerHelper } from '../exhaustion-trace-analyzer-helper';

@Injectable()
export class ExhaustionTraceAnalyzerByThemeAdapter extends BaseExhaustionTraceAnalyzerAdapter {
    protected readonly logger = new Logger(
        ExhaustionTraceAnalyzerByThemeAdapter.name,
    );

    constructor(exhaustionTraceAnalyzerHelper: ExhaustionTraceAnalyzerHelper) {
        super(exhaustionTraceAnalyzerHelper);
    }

    public transformToTitle() {
        return `종목 세력 추적 분석`;
    }

    protected async getStocks(target: string): Promise<Stock[]> {
        const themeStocks =
            await this.exhaustionTraceAnalyzerHelper.getThemeStocksByThemeCode(
                target,
            );
        const stockCodes = themeStocks.map(
            (stockGroupStock) => stockGroupStock.stockCode,
        );

        return this.exhaustionTraceAnalyzerHelper.getStocks(stockCodes);
    }

    protected getStockInvestors(
        stocks: Stock[],
    ): Promise<StockDailyInvestor[]> {
        return this.exhaustionTraceAnalyzerHelper.getStockInvestorsFromApi(
            stocks,
        );
    }

    protected getStockHourForeignerInvestors(
        stocks: Stock[],
    ): Promise<StockHourForeignerInvestor[]> {
        return this.exhaustionTraceAnalyzerHelper.getStockHourForeignerInvestorsByStocksFromApi(
            stocks,
        );
    }
}
