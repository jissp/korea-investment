import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { CallbackEvent } from '@modules/gemini-cli';
import { AiAnalysisReportService } from '@app/modules/repositories/ai-analysis-report';
import {
    AnalysisCompletedEventBody,
    StockAnalyzerEventType,
} from './stock-analyzer.types';

@Injectable()
export class StockAnalyzerListener {
    private readonly logger = new Logger(StockAnalyzerListener.name);

    constructor(
        private readonly aiAnalysisReportService: AiAnalysisReportService,
    ) {}

    @OnEvent(StockAnalyzerEventType.AnalysisCompleted)
    public async handleCompletedPrompt(
        event: CallbackEvent<AnalysisCompletedEventBody>,
    ) {
        try {
            const { reportType, reportTarget, title } = event.eventData;

            await this.aiAnalysisReportService.addReport({
                reportType,
                reportTarget,
                title,
                content: event.prompt.response,
            });
        } catch (error) {
            this.logger.error(error);
        }
    }
}
