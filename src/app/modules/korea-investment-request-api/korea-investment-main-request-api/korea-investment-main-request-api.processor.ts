import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnQueueProcessor } from '@modules/queue';
import { KoreaInvestmentHelperService } from '@modules/korea-investment/korea-investment-helper';
import {
    BaseKoreaInvestmentRequestApiProcessor,
    KoreaInvestmentRequestApiType,
} from '@app/modules/korea-investment-request-api/common';

@Injectable()
export class KoreaInvestmentMainRequestApiProcessor extends BaseKoreaInvestmentRequestApiProcessor {
    private readonly logger = new Logger(
        KoreaInvestmentMainRequestApiProcessor.name,
    );

    constructor(koreaInvestmentHelperService: KoreaInvestmentHelperService) {
        super(koreaInvestmentHelperService);
    }

    @OnQueueProcessor(KoreaInvestmentRequestApiType.Main, {
        concurrency: 2,
        limiter: {
            max: 2,
            duration: 1000,
        },
    })
    async process(job: Job) {
        try {
            return this.processRequestApi(job);
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }
}
