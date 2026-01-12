import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { OnQueueProcessor } from '@modules/queue';
import { KoreaInvestmentRequestApiHelper } from '@app/modules/korea-investment-request-api';
import { AccountStockGroupStockService } from '@app/modules/repositories/account-stock-group';
import { KoreaInvestmentAccountCrawlerType } from '../korea-investment-account-crawler.types';
import { DomesticStockQuotationsIntstockMultPriceOutput } from '@modules/korea-investment/korea-investment-quotation-client';
import { AccountStockGroupStockTransformer } from '../transformers';

@Injectable()
export class AccountStockPriceProcessor {
    constructor(
        private readonly koreaInvestmentRequestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly accountStockGroupStockService: AccountStockGroupStockService,
    ) {}

    @OnQueueProcessor(
        KoreaInvestmentAccountCrawlerType.UpdateAccountStockGroupStockPrices,
    )
    async processUpdateAccountStockGroupStockPrices(job: Job) {
        const childrenResponses =
            await this.koreaInvestmentRequestApiHelper.getChildResponses<
                any,
                DomesticStockQuotationsIntstockMultPriceOutput[]
            >(job);

        const multiPriceOutputs = childrenResponses.flatMap(
            ({ response }) => response.output,
        );

        const transformer = new AccountStockGroupStockTransformer();
        const transformedDtoList = multiPriceOutputs.map((output) =>
            transformer.transform(output),
        );

        await this.accountStockGroupStockService.update(transformedDtoList);
    }
}
