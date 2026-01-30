import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { TransformByInvestorHelper } from '@app/modules/ai-analyzer';
import { ThemeModule } from '@app/modules/repositories/theme';
import {
    ExhaustionTraceAnalyzerAdapter,
    ExhaustionTraceAnalyzerByThemeAdapter,
} from './adapters';
import { ExhaustionTraceAnalyzerFlowType } from './exhaustion-trace-analyzer.types';
import { ExhaustionTraceAnalyzerHelperModule } from './exhaustion-trace-analyzer-helper';
import { ExhaustionTraceAnalyzerFactory } from './exhaustion-trace-analyzer.factory';
import { ExhaustionTraceAnalyzerProcessor } from './exhaustion-trace-analyzer.processor';

const flowTypes = [ExhaustionTraceAnalyzerFlowType.Request];
const flowProviders = QueueModule.getFlowProviders(flowTypes);

@Module({
    imports: [
        QueueModule.forFeature({
            flowTypes,
        }),
        ThemeModule,
        ExhaustionTraceAnalyzerHelperModule,
    ],
    providers: [
        TransformByInvestorHelper,
        ExhaustionTraceAnalyzerFactory,
        ExhaustionTraceAnalyzerAdapter,
        ExhaustionTraceAnalyzerByThemeAdapter,
        ExhaustionTraceAnalyzerProcessor,
        ...flowProviders,
    ],
    exports: [ExhaustionTraceAnalyzerFactory],
})
export class ExhaustionTraceAnalyzerModule {}
