import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnQueueProcessor } from '@modules/queue';
import { KoreaInvestmentHelperService } from '@modules/korea-investment/korea-investment-helper';
import {
    KoreaInvestmentCallApiParam,
    KoreaInvestmentRequestApiType,
} from './korea-investment-request-api.type';

@Injectable()
export class KoreaInvestmentRequestApiProcessor {
    private readonly logger = new Logger(
        KoreaInvestmentRequestApiProcessor.name,
    );

    constructor(
        private readonly koreaInvestmentHelperService: KoreaInvestmentHelperService,
    ) {}

    /**
     * 한국투자증권 API를 호출하는 Job (백그라운드를 통한 호출만 이에 해당)
     * Rest API는 초당 10건씩만 호출이 가능하기 때문에 비동기 Job을 통해 호출량을 제어합니다.
     *
     * @see https://apiportal.koreainvestment.com/community/10000000-0000-0011-0000-000000000002/post/8548106c-c7a8-4126-abb7-b8ec46a8cb5c
     * @param job
     */
    @OnQueueProcessor(KoreaInvestmentRequestApiType, {
        concurrency: 6,
        limiter: {
            max: 6,
            duration: 1000,
        },
    })
    public async processorCallKoreaInvestmentApi(
        job: Job<KoreaInvestmentCallApiParam>,
    ) {
        try {
            const { url, tradeId, params } = job.data;

            const headers =
                await this.koreaInvestmentHelperService.buildHeaders(tradeId);

            const response = await this.koreaInvestmentHelperService.request({
                method: 'GET',
                url,
                params,
                headers,
            });

            return {
                request: job.data,
                response,
            };
        } catch (error) {
            this.logger.error(error.message);

            throw error;
        }
    }
}
