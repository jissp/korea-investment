import { Job } from 'bullmq';
import { KoreaInvestmentCallApiParam } from '@app/modules/korea-investment-request-api/common/korea-investment-request-api.type';
import { KoreaInvestmentHelperService } from '@modules/korea-investment/korea-investment-helper';

export abstract class BaseKoreaInvestmentRequestApiProcessor {
    protected constructor(
        protected readonly koreaInvestmentHelperService: KoreaInvestmentHelperService,
    ) {}

    protected async processRequestApi(job: Job<KoreaInvestmentCallApiParam>) {
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
    }
}
