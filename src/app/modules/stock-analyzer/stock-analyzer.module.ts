import { Module } from '@nestjs/common';
import { GeminiCliModule } from '@modules/gemini-cli';
import { QueueModule } from '@modules/queue';
import { NaverApiModule } from '@modules/naver/naver-api';
import { KoreaInvestmentQuotationClientModule } from '@modules/korea-investment/korea-investment-quotation-client';
import { StockModule } from '@app/modules/repositories/stock';
import { KeywordModule } from '@app/modules/repositories/keyword';
import { NewsModule } from '@app/modules/repositories/news';
import { AiAnalysisReportModule } from '@app/modules/repositories/ai-analysis-report';
import { MarketIndexModule } from '@app/modules/repositories/market-index';
import {
    StockAnalyzerFlowType,
    StockAnalyzerQueueType,
} from './stock-analyzer.types';
import {
    RequestLatestNewsAnalysisProcessor,
    RequestStockAnalysisProcessor,
    StockAnalyzerPromptProcessor,
} from './processors';
import {
    KeywordGroupAnalysisAdapter,
    LatestNewsAnalysisAdapter,
    StockAnalysisAdapter,
} from './adapters';
import { StockAnalyzerService } from './stock-analyzer.service';
import { StockAnalysisAdapterFactory } from './stock-analysis-adapter.factory';

const RepositoryModules = [
    StockModule,
    NewsModule,
    KeywordModule,
    AiAnalysisReportModule,
    MarketIndexModule,
];

const flowTypes = [
    StockAnalyzerFlowType.RequestAnalysis,
    StockAnalyzerFlowType.RequestStockAnalysis,
    StockAnalyzerFlowType.RequestLatestNews,
];
const queueTypes = [StockAnalyzerQueueType.PromptToGeminiCli];
const flowProviders = QueueModule.getFlowProviders(flowTypes);
const queueProviders = QueueModule.getQueueProviders(queueTypes);

const processors = [
    StockAnalyzerPromptProcessor,
    RequestStockAnalysisProcessor,
    RequestLatestNewsAnalysisProcessor,
];

const adapters = [
    StockAnalysisAdapter,
    KeywordGroupAnalysisAdapter,
    LatestNewsAnalysisAdapter,
];

@Module({
    imports: [
        QueueModule.forFeature({
            flowTypes,
            queueTypes,
        }),
        GeminiCliModule,
        NaverApiModule,
        KoreaInvestmentQuotationClientModule,
        ...RepositoryModules,
    ],
    providers: [
        ...flowProviders,
        ...queueProviders,
        ...adapters,
        ...processors,
        StockAnalyzerService,
        StockAnalysisAdapterFactory,
    ],
    exports: [...flowProviders, ...queueProviders, StockAnalyzerService],
})
export class StockAnalyzerModule {}
