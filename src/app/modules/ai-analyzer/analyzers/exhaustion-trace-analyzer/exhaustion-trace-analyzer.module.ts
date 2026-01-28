import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { StockInvestorModule } from '@app/modules/repositories/stock-investor';
import { ExhaustionTraceAnalyzerFlowType } from './exhaustion-trace-analyzer.types';
import { ExhaustionTraceAnalyzerAdapter } from './exhaustion-trace-analyzer.adapter';
import { ExhaustionTraceAnalyzerProcessor } from './exhaustion-trace-analyzer.processor';

const flowTypes = [ExhaustionTraceAnalyzerFlowType.Request];
const flowProviders = QueueModule.getFlowProviders(flowTypes);

@Module({
    imports: [
        QueueModule.forFeature({
            flowTypes,
        }),
        StockInvestorModule,
    ],
    providers: [
        ExhaustionTraceAnalyzerAdapter,
        ExhaustionTraceAnalyzerProcessor,
        ...flowProviders,
    ],
    exports: [ExhaustionTraceAnalyzerAdapter],
})
export class ExhaustionTraceAnalyzerModule {}
