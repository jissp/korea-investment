import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnQueueProcessor } from '@modules/queue';
import {
    DomesticInvestorTradeByStockDailyOutput1,
    DomesticInvestorTradeByStockDailyOutput2,
    DomesticInvestorTradeByStockDailyParam,
} from '@modules/korea-investment/common';
import { StockInvestorTransformer } from '@app/common/korea-investment';
import { KoreaInvestmentRequestApiHelper } from '@app/modules/korea-investment-request-api/common';
import { StockInvestorService } from '@app/modules/repositories/stock-investor';
import { StockCrawlerFlowType } from '../stock-crawler.types';

@Injectable()
export class StockCrawlerProcessor {
    private readonly logger = new Logger(StockCrawlerProcessor.name);

    private readonly stockInvestorTransformer = new StockInvestorTransformer();

    constructor(
        private readonly koreaInvestmentRequestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly stockInvestorService: StockInvestorService,
    ) {}

    @OnQueueProcessor(StockCrawlerFlowType.RequestStockInvestor)
    async processRequestStockInvestor(job: Job) {
        try {
            const childrenResponses =
                await this.koreaInvestmentRequestApiHelper.getChildMultiResponses<
                    DomesticInvestorTradeByStockDailyParam,
                    DomesticInvestorTradeByStockDailyOutput1,
                    DomesticInvestorTradeByStockDailyOutput2[]
                >(job);

            const stockContents = childrenResponses.map(
                ({ request, response }) => ({
                    stockCode: request.params.FID_INPUT_ISCD,
                    outputs: response.output2,
                }),
            );

            const transformedStockInvestors = stockContents.flatMap(
                ({ stockCode, outputs }) =>
                    outputs.map((output) =>
                        this.stockInvestorTransformer.transform({
                            stockCode,
                            output,
                        }),
                    ),
            );

            await this.stockInvestorService.upsert(transformedStockInvestors);
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }
}
