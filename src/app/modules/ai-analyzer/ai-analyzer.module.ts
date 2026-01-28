import { Module } from '@nestjs/common';
import { GeminiCliModule } from '@modules/gemini-cli';
import { QueueModule } from '@modules/queue';
import { NaverApiModule } from '@modules/naver/naver-api';
import {
    AiAnalysisReportModule,
    ReportType,
} from '@app/modules/repositories/ai-analysis-report';
import {
    ExhaustionTraceAnalyzerAdapter,
    ExhaustionTraceAnalyzerModule,
} from '@app/modules/ai-analyzer/analyzers/exhaustion-trace-analyzer';
import {
    MarketAnalyzerAdapter,
    MarketAnalyzerModule,
} from '@app/modules/ai-analyzer/analyzers/market-analyzer';
import {
    StockAnalyzerAdapter,
    StockAnalyzerModule,
} from '@app/modules/ai-analyzer/analyzers/stock-analyzer';
import { BaseAnalysisAdapter } from './common';
import {
    AiAnalyzerFlowType,
    AiAnalyzerProvider,
    AiAnalyzerQueueType,
} from './ai-analyzer.types';
import { AiAnalyzerService } from './ai-analyzer.service';
import { AiAnalyzerAdapterFactory } from './ai-analyzer-adapter.factory';
import { AiAnalyzerProcessor } from './ai-analyzer.processor';

const flowTypes = [AiAnalyzerFlowType.RequestAnalysis];
const queueTypes = [AiAnalyzerQueueType.PromptToGeminiCli];
const flowProviders = QueueModule.getFlowProviders(flowTypes);
const queueProviders = QueueModule.getQueueProviders(queueTypes);

const AnalyzerModules = [
    ExhaustionTraceAnalyzerModule,
    MarketAnalyzerModule,
    StockAnalyzerModule,
];

@Module({
    imports: [
        QueueModule.forFeature({
            flowTypes,
            queueTypes,
        }),
        GeminiCliModule,
        NaverApiModule,
        AiAnalysisReportModule,
        ...AnalyzerModules,
    ],
    providers: [
        ...flowProviders,
        ...queueProviders,
        {
            provide: AiAnalyzerProvider.AdapterMap,
            inject: [
                StockAnalyzerAdapter,
                MarketAnalyzerAdapter,
                ExhaustionTraceAnalyzerAdapter,
            ],
            useFactory: (
                stockAnalysisAdapter: StockAnalyzerAdapter,
                marketAnalysisAdapter: MarketAnalyzerAdapter,
                exhaustionTraceAnalysisAdapter: ExhaustionTraceAnalyzerAdapter,
            ) => {
                const map = new Map<ReportType, BaseAnalysisAdapter<any>>();

                map.set(ReportType.Stock, stockAnalysisAdapter);
                map.set(ReportType.Market, marketAnalysisAdapter);
                map.set(
                    ReportType.ExhaustionTrace,
                    exhaustionTraceAnalysisAdapter,
                );

                return map;
            },
        },
        AiAnalyzerAdapterFactory,
        AiAnalyzerProcessor,
        AiAnalyzerService,
    ],
    exports: [...flowProviders, ...queueProviders, AiAnalyzerService],
})
export class AiAnalyzerModule {}
