import { Module } from '@nestjs/common';
import { KoreaInvestmentQuotationClientModule } from '@modules/korea-investment/korea-investment-quotation-client';
import { StockModule } from '@app/modules/repositories/stock';
import { FavoriteStockModule } from '@app/modules/repositories/favorite-stock';
import { ThemeModule } from '@app/modules/repositories/theme';
import { StockInvestorModule } from '@app/modules/repositories/stock-investor';
import { TransformByInvestorHelper } from '@app/modules/ai-analyzer';
import { ExhaustionTraceAnalyzerHelper } from './exhaustion-trace-analyzer.helper';

@Module({
    imports: [
        KoreaInvestmentQuotationClientModule,
        StockModule,
        FavoriteStockModule,
        ThemeModule,
        StockInvestorModule,
    ],
    providers: [TransformByInvestorHelper, ExhaustionTraceAnalyzerHelper],
    exports: [ExhaustionTraceAnalyzerHelper],
})
export class ExhaustionTraceAnalyzerHelperModule {}
