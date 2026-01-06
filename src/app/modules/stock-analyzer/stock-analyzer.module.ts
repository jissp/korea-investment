import { Module } from '@nestjs/common';
import { GeminiCliModule } from '@modules/gemini-cli';
import { NaverApiModule } from '@modules/naver/naver-api';
import { KoreaInvestmentQuotationClientModule } from '@modules/korea-investment/korea-investment-quotation-client';
import { KoreaInvestmentSettingModule } from '@app/modules/korea-investment-setting';
import { AnalysisRepositoryModule } from '@app/modules/repositories';
import { StockAnalyzerListener } from './stock-analyzer.listener';
import { StockAnalyzerService } from './stock-analyzer.service';

@Module({
    imports: [
        GeminiCliModule,
        NaverApiModule,
        KoreaInvestmentQuotationClientModule,
        KoreaInvestmentSettingModule,
        AnalysisRepositoryModule,
    ],
    providers: [StockAnalyzerListener, StockAnalyzerService],
    exports: [StockAnalyzerService],
})
export class StockAnalyzerModule {}
