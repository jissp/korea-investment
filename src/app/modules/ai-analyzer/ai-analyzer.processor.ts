import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnQueueProcessor } from '@modules/queue';
import { GeminiCliService } from '@modules/gemini-cli';
import { AiAnalysisReportService } from '@app/modules/repositories/ai-analysis-report';
import {
    AiAnalyzerFlowType,
    AiAnalyzerQueueType,
    PromptToGeminiCliBody,
    RequestAnalysisBody,
} from './ai-analyzer.types';

@Injectable()
export class AiAnalyzerProcessor {
    private readonly logger = new Logger(AiAnalyzerProcessor.name);

    constructor(
        private readonly geminiCliService: GeminiCliService,
        private readonly aiAnalysisReportService: AiAnalysisReportService,
    ) {}

    @OnQueueProcessor(AiAnalyzerFlowType.RequestAnalysis)
    async processRequestAnalysis(job: Job<RequestAnalysisBody>) {
        try {
            const { reportType, reportTarget, title } = job.data;
            const childrenValues = await job.getChildrenValues<string>();
            const results = Object.values(childrenValues);

            await this.aiAnalysisReportService.deleteReport(
                reportType,
                reportTarget,
            );
            await this.aiAnalysisReportService.addReport({
                reportType,
                reportTarget,
                title,
                content: results[0],
            });

            // await this.slackService.send(event.prompt.response);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    @OnQueueProcessor(AiAnalyzerQueueType.PromptToGeminiCli, {
        concurrency: 3,
    })
    async processPromptToGeminiCli(job: Job<PromptToGeminiCliBody>) {
        try {
            const { prompt, model } = job.data;

            const result = await this.geminiCliService.requestSyncPrompt(
                prompt,
                {
                    model,
                },
            );

            this.logger.debug(result);
            this.logger.debug('processed');

            return result.response;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
