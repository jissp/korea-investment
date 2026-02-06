import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GeminiCliModule } from '@modules/gemini-cli';
import { QueueModule } from '@modules/queue';
import { BotName, SlackModule } from '@modules/slack';
import { NaverApiModule } from '@modules/naver/naver-api';
import {
    AiAnalysisReportModule,
    ReportType,
} from '@app/modules/repositories/ai-analysis-report';
import { ExhaustionTraceAnalyzerModule } from '@app/modules/analysis/ai-analyzer/analyzers/exhaustion-trace-analyzer';
import {
    MarketAnalyzerAdapter,
    MarketAnalyzerModule,
} from '@app/modules/analysis/ai-analyzer/analyzers/market-analyzer';
import {
    StockAnalyzerAdapter,
    StockAnalyzerModule,
} from '@app/modules/analysis/ai-analyzer/analyzers/stock-analyzer';
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
        SlackModule.forFeature(BotName.StockBot, {
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) =>
                configService.get<string>('SLACK_STOCK_GEMINI_LOG_CHANNEL_ID'),
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
            inject: [StockAnalyzerAdapter, MarketAnalyzerAdapter],
            useFactory: (
                stockAnalysisAdapter: StockAnalyzerAdapter,
                marketAnalysisAdapter: MarketAnalyzerAdapter,
            ) => {
                const map = new Map<ReportType, BaseAnalysisAdapter<unknown>>();

                map.set(ReportType.Stock, stockAnalysisAdapter);
                map.set(ReportType.Market, marketAnalysisAdapter);

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
