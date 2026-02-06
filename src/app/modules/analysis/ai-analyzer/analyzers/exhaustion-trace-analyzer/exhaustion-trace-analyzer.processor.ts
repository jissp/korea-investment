import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { ExhaustionTraceAnalyzerFlowType } from './exhaustion-trace-analyzer.types';

@Processor(ExhaustionTraceAnalyzerFlowType.Request)
export class ExhaustionTraceAnalyzerProcessor extends WorkerHost {
    private readonly logger = new Logger(ExhaustionTraceAnalyzerProcessor.name);

    constructor() {
        super();
    }

    async process(job: Job) {
        this.logger.debug('processing');

        try {
            const results = await this.getChildrenValues(job);

            return results.join('\n\n');
        } catch (error) {
            this.logger.error(error);
            throw error;
        } finally {
            this.logger.debug('processed');
        }
    }

    /**
     * @param job
     * @private
     */
    private async getChildrenValues(job: Job) {
        const childrenValues = await job.getChildrenValues<string>();

        return Object.values(childrenValues);
    }
}
