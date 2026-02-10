import { FlowProducer } from 'bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { normalizeError } from '@common/domains';
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
            this.logger.error(normalizeError(error));
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

    /**
     * prompt가 코드 블록으로 감싸져있는 경우 제거.
     * 정규식을 쓰지 않은 이유는 Wrap 부분만 제거하기 위함으로 단순 문자열 함수로 구현
     * @param prompt
     * @private
     */
    public removeCodeBlockWrap(prompt: string) {
        const codeBlockTag = '```';
        // 시작과 끝이 ``` 로 시작하지 않으면 그대로 반환
        if (
            !prompt.startsWith(codeBlockTag) ||
            !prompt.endsWith(codeBlockTag)
        ) {
            return prompt;
        }

        // 양쪽 모두 ``` 로 감싸져있으면 제거
        return prompt
            .slice(codeBlockTag.length, prompt.length - codeBlockTag.length)
            .trim();
    }
}
