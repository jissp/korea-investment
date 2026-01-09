import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { getStockName } from '@common/domains';
import { CallbackEvent } from '@modules/gemini-cli';
import {
    AiAnalysisReportService,
    ReportType,
} from '@app/modules/repositories/ai-analysis-report';
import { KeywordGroup } from '@app/modules/repositories/keyword';
import { StockAnalyzerEventType } from './stock-analyzer.types';

@Injectable()
export class StockAnalyzerListener {
    private readonly logger = new Logger(StockAnalyzerListener.name);

    constructor(
        private readonly aiAnalysisReportService: AiAnalysisReportService,
    ) {}

    @OnEvent(StockAnalyzerEventType.AnalysisCompleted)
    public async handleCompletedPrompt(
        event: CallbackEvent<{
            stockCode: string;
        }>,
    ) {
        try {
            const { stockCode } = event.eventData;
            const stockName = getStockName(stockCode);

            await this.aiAnalysisReportService.addReport({
                reportType: ReportType.Stock,
                reportTarget: stockCode,
                title: `${stockName} 종목 분석 리포트`,
                content: event.prompt.response,
            });
        } catch (error) {
            this.logger.error(error);
        }
    }

    @OnEvent(StockAnalyzerEventType.AnalysisCompletedForKeywordGroup)
    public async handleCompletedPromptForKeywordGroup(
        event: CallbackEvent<{
            keywordGroup: KeywordGroup;
        }>,
    ) {
        try {
            const { keywordGroup } = event.eventData;

            await this.aiAnalysisReportService.addReport({
                reportType: ReportType.KeywordGroup,
                reportTarget: keywordGroup.id.toString(),
                title: `${keywordGroup.name} 분석 리포트`,
                content: event.prompt.response,
            });
        } catch (error) {
            this.logger.error(error);
        }
    }
}
