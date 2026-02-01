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
        try {
            this.logger.debug('processing');
            const childrenValues = await job.getChildrenValues<string>();
            const results = Object.values(childrenValues);

            const mergedResultPrompts = results.join('\n\n');

            this.logger.debug('processed');
            return mergedResultPrompts;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
