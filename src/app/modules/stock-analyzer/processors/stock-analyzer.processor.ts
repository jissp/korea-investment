import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { GeminiCliService } from '@modules/gemini-cli';
import { OnQueueProcessor } from '@modules/queue';
import { AiAnalysisReportService } from '@app/modules/repositories/ai-analysis-report';
import {
    PromptToGeminiCliBody,
    RequestAnalysisBody,
    StockAnalyzerFlowType,
    StockAnalyzerQueueType,
} from '../stock-analyzer.types';

@Injectable()
export class StockAnalyzerPromptProcessor {
    private readonly logger = new Logger(StockAnalyzerPromptProcessor.name);

    constructor(
        private readonly geminiCliService: GeminiCliService,
        private readonly aiAnalysisReportService: AiAnalysisReportService,
    ) {}

    @OnQueueProcessor(StockAnalyzerFlowType.RequestAnalysis)
    async processRequestAnalysis(job: Job<RequestAnalysisBody>) {
        try {
            const { reportType, reportTarget, title } = job.data;
            const childrenValues = await job.getChildrenValues();
            const results = Object.values(childrenValues);

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

    @OnQueueProcessor(StockAnalyzerQueueType.PromptToGeminiCli, {
        concurrency: 3,
    })
    async processPromptToGeminiCli(job: Job<PromptToGeminiCliBody>) {
        try {
            const { prompt, model } = job.data;

            const { response } = await this.geminiCliService.requestSyncPrompt(
                prompt,
                {
                    model,
                },
            );

            this.logger.log('processed');
            return response;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
