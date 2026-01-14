import { Module } from '@nestjs/common';
import { GeminiCliModule } from '@modules/gemini-cli';
import { NaverApiModule } from '@modules/naver/naver-api';
import { KoreaInvestmentQuotationClientModule } from '@modules/korea-investment/korea-investment-quotation-client';
import { StockModule } from '@app/modules/repositories/stock';
import { KeywordModule } from '@app/modules/repositories/keyword';
import { AiAnalysisReportModule } from '@app/modules/repositories/ai-analysis-report';
import { StockAnalyzerListener } from './stock-analyzer.listener';
import { StockAnalyzerService } from './stock-analyzer.service';

@Module({
    imports: [
        GeminiCliModule,
        NaverApiModule,
        KoreaInvestmentQuotationClientModule,
        StockModule,
        KeywordModule,
        AiAnalysisReportModule,
    ],
    providers: [StockAnalyzerListener, StockAnalyzerService],
    exports: [StockAnalyzerService],
})
export class StockAnalyzerModule {}
