import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { getStockName } from '@common/domains';
import { CallbackEvent } from '@modules/gemini-cli';
import { AnalysisRepository } from '@app/modules/repositories/analysis-repository';
import { StockAnalyzerEventType } from './stock-analyzer.types';

@Injectable()
export class StockAnalyzerListener {
    private readonly logger = new Logger(StockAnalyzerListener.name);

    constructor(private readonly analysisRepository: AnalysisRepository) {}

    @OnEvent(StockAnalyzerEventType.AnalysisCompleted)
    public async handleCompletedPrompt(
        event: CallbackEvent<{
            stockCode: string;
        }>,
    ) {
        try {
            const { stockCode } = event.eventData;

            await this.analysisRepository.setAIAnalysisStock({
                stockCode,
                stockName: getStockName(stockCode),
                content: event.prompt.response,
                updatedAt: new Date(),
            });
        } catch (error) {
            this.logger.error(error);
        }
    }

    @OnEvent(StockAnalyzerEventType.AnalysisCompletedForKeywordGroup)
    public async handleCompletedPromptForKeywordGroup(
        event: CallbackEvent<{
            groupName: string;
        }>,
    ) {
        try {
            const { groupName } = event.eventData;

            await this.analysisRepository.setAIAnalysisKeywordGroup({
                groupName,
                content: event.prompt.response,
                updatedAt: new Date(),
            });
        } catch (error) {
            this.logger.error(error);
        }
    }
}
