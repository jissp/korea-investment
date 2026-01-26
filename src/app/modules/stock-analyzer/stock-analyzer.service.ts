import { FlowProducer } from 'bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getDefaultJobOptions } from '@modules/queue';
import { ReportType } from '@app/modules/repositories/ai-analysis-report';
import {
    StockAnalyzerFlowType,
    StockAnalyzerQueueType,
} from './stock-analyzer.types';
import { StockAnalysisAdapterFactory } from './stock-analysis-adapter.factory';

@Injectable()
export class StockAnalyzerService {
    private readonly logger = new Logger(StockAnalyzerService.name);

    constructor(
        private readonly stockAnalysisAdapterFactory: StockAnalysisAdapterFactory,
        @Inject(StockAnalyzerFlowType.RequestAnalysis)
        private readonly requestAnalysisFlow: FlowProducer,
    ) {}

    /**
     * AI 분석을 요청합니다.
     * @param reportType
     * @param reportTarget
     */
    public async requestAnalysis(reportType: ReportType, reportTarget: string) {
        try {
            const adapter = this.stockAnalysisAdapterFactory.create(reportType);
            const collectedData = await adapter.collectData(reportTarget);

            const queueName = StockAnalyzerFlowType.RequestAnalysis;
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
                        [StockAnalyzerQueueType.PromptToGeminiCli]: {
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
}
