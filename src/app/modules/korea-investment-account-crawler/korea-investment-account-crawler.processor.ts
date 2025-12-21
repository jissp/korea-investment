import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { OnQueueProcessor } from '@modules/queue';
import { KoreaInvestmentAccountService } from '@app/modules/korea-investment-account';
import { KoreaInvestmentRequestApiHelper } from '@app/modules/korea-investment-request-api';
import {
    KoreaInvestmentAccountCrawlerType,
    KoreaInvestmentAccountOutput,
    KoreaInvestmentAccountOutput2,
    KoreaInvestmentAccountParam,
    KoreaInvestmentAccountStockOutput,
    KoreaInvestmentAccountStockOutput2,
    KoreaInvestmentAccountStockParam,
} from './korea-investment-account-crawler.types';

@Injectable()
export class KoreaInvestmentAccountCrawlerProcessor {
    constructor(
        private readonly koreaInvestmentRequestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly koreaInvestmentAccountService: KoreaInvestmentAccountService,
    ) {}

    /**
     * @param job
     */
    @OnQueueProcessor(KoreaInvestmentAccountCrawlerType.RequestAccount)
    async processRequestAccount(job: Job) {
        const childrenResponses =
            await this.koreaInvestmentRequestApiHelper.getChildMultiResponses<
                KoreaInvestmentAccountParam,
                KoreaInvestmentAccountOutput[],
                KoreaInvestmentAccountOutput2
            >(job);

        await Promise.all(
            childrenResponses.map(({ request: { params }, response }) =>
                this.koreaInvestmentAccountService.setAccountInfo(
                    this.buildAccountNumber(params.CANO, params.ACNT_PRDT_CD),
                    response.output2,
                ),
            ),
        );
    }

    /**
     * @param job
     */
    @OnQueueProcessor(KoreaInvestmentAccountCrawlerType.RequestAccountStocks)
    async processRequestAccountStock(job: Job) {
        const childrenResponses =
            await this.koreaInvestmentRequestApiHelper.getChildMultiResponses<
                KoreaInvestmentAccountStockParam,
                KoreaInvestmentAccountStockOutput[],
                KoreaInvestmentAccountStockOutput2[]
            >(job);

        for (const {
            request: { params },
            response,
        } of childrenResponses) {
            await this.koreaInvestmentAccountService.setAccountStocks(
                this.buildAccountNumber(params.CANO, params.ACNT_PRDT_CD),
                response.output1,
            );
        }
    }

    /**
     * @param caNo
     * @param prdtCd
     * @private
     */
    private buildAccountNumber(caNo: string, prdtCd: string): string {
        return [caNo, prdtCd].join('-');
    }
}
