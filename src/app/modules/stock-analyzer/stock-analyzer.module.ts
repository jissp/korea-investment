import { Module } from '@nestjs/common';
import { GeminiCliModule } from '@modules/gemini-cli';
import { NaverApiModule } from '@modules/naver/naver-api';
import { KoreaInvestmentQuotationClientModule } from '@modules/korea-investment/korea-investment-quotation-client';
import { StockModule } from '@app/modules/repositories/stock';
import { KeywordModule } from '@app/modules/repositories/keyword';
import { NewsModule } from '@app/modules/repositories/news';
import { AiAnalysisReportModule } from '@app/modules/repositories/ai-analysis-report';
import {
    KeywordGroupAnalysisAdapter,
    LatestNewsAnalysisAdapter,
    StockAnalysisAdapter,
} from './adapters';
import { StockAnalyzerListener } from './stock-analyzer.listener';
import { StockAnalyzerService } from './stock-analyzer.service';
import { StockAnalysisAdapterFactory } from './stock-analysis-adapter.factory';

const RepositoryModules = [
    StockModule,
    NewsModule,
    KeywordModule,
    AiAnalysisReportModule,
];

const Adapters = [
    StockAnalysisAdapter,
    KeywordGroupAnalysisAdapter,
    LatestNewsAnalysisAdapter,
];

@Module({
    imports: [
        GeminiCliModule,
        NaverApiModule,
        KoreaInvestmentQuotationClientModule,
        ...RepositoryModules,
    ],
    providers: [
        ...Adapters,
        StockAnalyzerListener,
        StockAnalyzerService,
        StockAnalysisAdapterFactory,
    ],
    exports: [StockAnalyzerService],
})
export class StockAnalyzerModule {}
