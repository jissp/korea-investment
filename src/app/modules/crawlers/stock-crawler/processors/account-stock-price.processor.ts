import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnQueueProcessor } from '@modules/queue';
import { DomesticStockQuotationsIntstockMultPriceOutput } from '@modules/korea-investment/common';
import { AccountStockGroupStockTransformer } from '@app/common/korea-investment';
import { KoreaInvestmentRequestApiHelper } from '@app/modules/korea-investment-request-api/common';
import { AccountStockGroupStockService } from '@app/modules/repositories/account-stock-group';
import { StockCrawlerFlowType } from '../stock-crawler.types';

@Injectable()
export class AccountStockPriceProcessor {
    private readonly logger = new Logger(AccountStockPriceProcessor.name);

    private readonly accountStockGroupStockTransformer =
        new AccountStockGroupStockTransformer();

    constructor(
        private readonly koreaInvestmentRequestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly accountStockGroupStockService: AccountStockGroupStockService,
    ) {}

    @OnQueueProcessor(StockCrawlerFlowType.UpdateAccountStockGroupStockPrices)
    async processUpdateAccountStockGroupStockPrices(job: Job) {
        try {
            const childrenResponses =
                await this.koreaInvestmentRequestApiHelper.getChildResponses<
                    any,
                    DomesticStockQuotationsIntstockMultPriceOutput[]
                >(job);

            const multiPriceOutputs = childrenResponses.flatMap(
                ({ response }) => response.output,
            );

            const transformedDtoList = multiPriceOutputs.map((output) =>
                this.accountStockGroupStockTransformer.transform({
                    output,
                }),
            );

            await this.accountStockGroupStockService.update(transformedDtoList);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
