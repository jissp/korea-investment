import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { normalizeError } from '@common/domains';
import { GeminiCliModel, GeminiCliService } from '@modules/gemini-cli';
import { formatTemplate } from '@app/common/domains';
import { MarketAnalyzerFlowType } from './market-analyzer.types';
import { MARKET_ANALYZER_PROMPT_TEMPLATE } from './prompts';

@Processor(MarketAnalyzerFlowType.Request)
export class MarketAnalyzerProcessor extends WorkerHost {
    private readonly logger = new Logger(MarketAnalyzerProcessor.name);

    constructor(private readonly geminiCliService: GeminiCliService) {
        super();
    }

    async process(job: Job) {
        this.logger.debug('processing');

        try {
            const results = await this.getChildrenValues(job);

            return await this.geminiCliService.requestPrompt(
                this.buildPrompt(results),
                {
                    model: GeminiCliModel.Gemini3Pro,
                },
            );
        } catch (error) {
            this.logger.error(normalizeError(error));
            throw error;
        } finally {
            this.logger.debug('processed');
        }
    }

    private async getChildrenValues(job: Job) {
        const childrenValues = await job.getChildrenValues<string>();

        return Object.values(childrenValues);
    }

    /**
     * @param mergedResultPrompts
     */
    public buildPrompt(mergedResultPrompts: string[]) {
        const currentDate = new Date();

        return formatTemplate(MARKET_ANALYZER_PROMPT_TEMPLATE, {
            currentDate: currentDate.toISOString(),
            mergedResultPrompts: mergedResultPrompts.join('\n\n'),
        });
    }
}
