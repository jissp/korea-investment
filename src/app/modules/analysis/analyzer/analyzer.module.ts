import { Module } from '@nestjs/common';
import { KoreaInvestmentCalendarModule } from '@app/modules/repositories/korea-investment-calendar';
import { StockModule } from '@app/modules/repositories/stock';
import { StockInvestorModule } from '@app/modules/repositories/stock-investor';
import { StockInvestorScoreCalculator } from './scores';
import { AnalyzerService } from './analyzer.service';

@Module({
    imports: [KoreaInvestmentCalendarModule, StockModule, StockInvestorModule],
    providers: [StockInvestorScoreCalculator, AnalyzerService],
    exports: [StockInvestorScoreCalculator, AnalyzerService],
})
export class AnalyzerModule {}
