import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnQueueProcessor } from '@modules/queue';
import {
    DomesticStockQuotationsInquireDailyItemChartPriceOutput,
    DomesticStockQuotationsInquireDailyItemChartPriceOutput2,
    DomesticStockQuotationsInquireInvestorOutput,
    DomesticStockQuotationsInquireInvestorParam,
} from '@modules/korea-investment/korea-investment-quotation-client';
import { KoreaInvestmentRequestApiHelper } from '@app/modules/korea-investment-request-api/common';
import { StockDailyInvestorService } from '@app/modules/repositories/stock-daily-investor';
import { StockCrawlerFlowType } from '../stock-crawler.types';
import { DomesticStockInvestorTransformer } from '../transformers';

@Injectable()
export class StockCrawlerProcessor {
    private readonly logger = new Logger(StockCrawlerProcessor.name);
    private readonly domesticStockInvestorTransformer =
        new DomesticStockInvestorTransformer();

    constructor(
        private readonly stockDailyInvestorService: StockDailyInvestorService,
        private readonly koreaInvestmentRequestApiHelper: KoreaInvestmentRequestApiHelper,
    ) {}

    @OnQueueProcessor(StockCrawlerFlowType.RequestStockInvestor)
    async processRequestStockInvestor(job: Job) {
        try {
            const childrenResponses =
                await this.koreaInvestmentRequestApiHelper.getChildResponses<
                    DomesticStockQuotationsInquireInvestorParam,
                    DomesticStockQuotationsInquireInvestorOutput[]
                >(job);

            const stockContents = childrenResponses.map(
                ({ request, response }) => ({
                    stockCode: request.params.FID_INPUT_ISCD,
                    outputs: response.output,
                }),
            );

            const transformedStockDailyInvestors = stockContents.flatMap(
                ({ stockCode, outputs }) =>
                    outputs.map((output) =>
                        this.domesticStockInvestorTransformer.transform({
                            stockCode,
                            output,
                        }),
                    ),
            );

            await this.stockDailyInvestorService.upsert(
                transformedStockDailyInvestors,
            );
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @OnQueueProcessor(StockCrawlerFlowType.RequestDailyItemChartPrice)
    async processRequestDailyItemChartPrice(job: Job) {
        try {
            const { stockCode } = job.data;

            const childrenResults =
                await this.koreaInvestmentRequestApiHelper.getChildMultiResponses<
                    any,
                    DomesticStockQuotationsInquireDailyItemChartPriceOutput,
                    DomesticStockQuotationsInquireDailyItemChartPriceOutput2[]
                >(job);

            if (!childrenResults.length) {
                this.logger.warn(`No data for stock: ${stockCode}`);
                return;
            }

            // const { response } = childrenResults[0];
            // await this.stockRepository.setDailyStockChart(stockCode, {
            //     output: response.output1,
            //     output2: response.output2,
            // });
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }
}
