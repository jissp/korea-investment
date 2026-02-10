import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { normalizeError } from '@common/domains';
import { OnQueueProcessor } from '@modules/queue';
import { GeminiCliService } from '@modules/gemini-cli';
import { SlackService } from '@modules/slack';
import { AiAnalysisReportService } from '@app/modules/repositories/ai-analysis-report';
import {
    AiAnalyzerFlowType,
    AiAnalyzerQueueType,
    PromptToGeminiCliBody,
    RequestAnalysisBody,
} from './ai-analyzer.types';
import { AiAnalyzerService } from './ai-analyzer.service';

@Injectable()
export class AiAnalyzerProcessor {
    private readonly logger = new Logger(AiAnalyzerProcessor.name);

    constructor(
        private readonly geminiCliService: GeminiCliService,
        private readonly slackService: SlackService,
        private readonly aiAnalyzerService: AiAnalyzerService,
        private readonly aiAnalysisReportService: AiAnalysisReportService,
    ) {}

    @OnQueueProcessor(AiAnalyzerFlowType.RequestAnalysis)
    async processRequestAnalysis(job: Job<RequestAnalysisBody>) {
        try {
            const { reportType, reportTarget, title } = job.data;
            const childrenValues = await job.getChildrenValues<string>();
            const results = Object.values(childrenValues);

            await this.aiAnalysisReportService.clearReport(
                reportType,
                reportTarget,
            );
            await this.aiAnalysisReportService.addReport({
                reportType,
                reportTarget,
                title,
                content: this.aiAnalyzerService.removeCodeBlockWrap(results[0]),
            });
        } catch (error) {
            this.logger.error(normalizeError(error));
            throw error;
        }
    }

    @OnQueueProcessor(AiAnalyzerQueueType.PromptToGeminiCli, {
        concurrency: 2,
    })
    async processPromptToGeminiCli(job: Job<PromptToGeminiCliBody>) {
        try {
            const { prompt, model } = job.data;

            await this.slackService.send(prompt);

            const result = await this.geminiCliService.requestPrompt(prompt, {
                model,
            });

            await this.slackService.send(result);

            return result;
        } catch (error) {
            this.logger.error(error);
            throw error;
        } finally {
            this.logger.debug('processed');
        }
    }
}
