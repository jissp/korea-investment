import { FlowProducer } from 'bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getDefaultJobOptions } from '@modules/queue';
import { ReportType } from '@app/modules/repositories/ai-analysis-report';
import { ExhaustionTraceAnalyzerFactory } from '@app/modules/analysis/ai-analyzer/analyzers/exhaustion-trace-analyzer/exhaustion-trace-analyzer.factory';
import { AiAnalyzerFlowType, AiAnalyzerQueueType } from './ai-analyzer.types';
import { AiAnalyzerAdapterFactory } from './ai-analyzer-adapter.factory';

@Injectable()
export class AiAnalyzerService {
    private readonly logger = new Logger(AiAnalyzerService.name);

    constructor(
        private readonly adapterFactory: AiAnalyzerAdapterFactory,
        private readonly exhaustionTraceAnalyzerFactory: ExhaustionTraceAnalyzerFactory,
        @Inject(AiAnalyzerFlowType.RequestAnalysis)
        private readonly requestAnalysisFlow: FlowProducer,
    ) {}

    /**
     * AI 분석을 요청합니다.
     * @param reportType
     * @param reportTarget
     */
    public async requestAnalysis(reportType: ReportType, reportTarget: string) {
        try {
            const adapter = await this.getAdapter(reportType, reportTarget);
            const collectedData = await adapter.collectData(reportTarget);

            const queueName = AiAnalyzerFlowType.RequestAnalysis;
            await this.requestAnalysisFlow.add(
                {
                    queueName,
                    name: queueName,
                    data: {
                        reportType,
                        reportTarget,
                        title: adapter.transformToTitle(collectedData),
                    },
                    children: [adapter.transformToFlowChildJob(collectedData)],
                },
                {
                    queuesOptions: {
                        [queueName]: {
                            defaultJobOptions: getDefaultJobOptions(),
                        },
                        [AiAnalyzerQueueType.PromptToGeminiCli]: {
                            defaultJobOptions: getDefaultJobOptions(),
                        },
                    },
                },
            );
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     * @param reportType
     * @param reportTarget
     */
    public async getAdapter(reportType: ReportType, reportTarget: string) {
        if (reportType === ReportType.ExhaustionTrace) {
            return this.exhaustionTraceAnalyzerFactory.create(reportTarget);
        }

        return this.adapterFactory.create(reportType);
    }
}
