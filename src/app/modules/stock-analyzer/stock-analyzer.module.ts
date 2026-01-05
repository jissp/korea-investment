import { Module } from '@nestjs/common';
import { GeminiCliModule } from '@modules/gemini-cli';
import { NaverApiModule } from '@modules/naver/naver-api';
import { KoreaInvestmentSettingModule } from '@app/modules/korea-investment-setting';
import { NewsRepositoryModule } from '@app/modules/repositories/news-repository';
import { AnalysisRepositoryModule } from '@app/modules/repositories/analysis-repository';
import { StockAnalyzerListener } from './stock-analyzer.listener';
import { StockAnalyzerService } from './stock-analyzer.service';

@Module({
    imports: [
        GeminiCliModule,
        NaverApiModule,
        KoreaInvestmentSettingModule,
        AnalysisRepositoryModule,
        NewsRepositoryModule,
    ],
    providers: [StockAnalyzerListener, StockAnalyzerService],
    exports: [StockAnalyzerService],
})
export class StockAnalyzerModule {}
