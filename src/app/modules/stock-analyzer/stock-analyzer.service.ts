import { Injectable, Logger } from '@nestjs/common';
import { GeminiCliService } from '@modules/gemini-cli';
import { ReportType } from '@app/modules/repositories/ai-analysis-report';
import { IAnalysisAdapter } from './adapters';
import { StockAnalysisAdapterFactory } from './stock-analysis-adapter.factory';
import { StockAnalyzerEventType } from '@app/modules/stock-analyzer/stock-analyzer.types';

@Injectable()
export class StockAnalyzerService {
    private readonly logger = new Logger(StockAnalyzerService.name);

    constructor(
        private readonly geminiCliService: GeminiCliService,
        private readonly stockAnalysisAdapterFactory: StockAnalysisAdapterFactory,
    ) {}

    /**
     * AI 분석을 요청합니다.
     * @param reportType
     * @param reportTarget
     */
    public async requestAnalysis(reportType: ReportType, reportTarget: string) {
        try {
            const adapter = this.stockAnalysisAdapterFactory.create(reportType);

            await this.executeAnalysis(adapter, reportTarget);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     * 데이터를 프롬프트로 변경 후 AI에게 요청합니다.
     * @param adapter
     * @param target
     * @private
     */
    private async executeAnalysis<TCollectedData>(
        adapter: IAnalysisAdapter<TCollectedData>,
        target: string,
    ): Promise<void> {
        const collectedData = await adapter.collectData(target);

        const prompt = adapter.transformToPrompt(collectedData);
        const eventConfig = adapter.getEventConfig(target, collectedData);

        this.geminiCliService.requestPrompt({
            callbackEvent: {
                eventName: StockAnalyzerEventType.AnalysisCompleted,
                eventData: eventConfig,
            },
            prompt,
        });
    }
}
