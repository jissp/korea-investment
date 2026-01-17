import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { toDateYmdByDate } from '@common/utils';
import { OnQueueProcessor } from '@modules/queue';
import {
    DomesticStockInvestorTrendEstimateOutput2,
    DomesticStockInvestorTrendEstimateParam,
    DomesticStockQuotationsInquireDailyItemChartPriceOutput,
    DomesticStockQuotationsInquireDailyItemChartPriceOutput2,
    DomesticStockQuotationsInquireInvestorOutput,
    DomesticStockQuotationsInquireInvestorParam,
} from '@modules/korea-investment/korea-investment-quotation-client';
import { KoreaInvestmentRequestApiHelper } from '@app/modules/korea-investment-request-api/common';
import {
    StockDailyInvestorService,
    StockHourForeignerInvestorService,
} from '@app/modules/repositories/stock-investor';
import { Stock } from '@app/modules/repositories/stock';
import { StockCrawlerFlowType } from '../stock-crawler.types';
import {
    DomesticStockInvestorTransformer,
    StockInvestorByEstimateTransformer,
} from '../transformers';

@Injectable()
export class StockCrawlerProcessor {
    private readonly logger = new Logger(StockCrawlerProcessor.name);
    private readonly domesticStockInvestorTransformer =
        new DomesticStockInvestorTransformer();

    constructor(
        private readonly koreaInvestmentRequestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly stockDailyInvestorService: StockDailyInvestorService,
        private readonly stockHourForeignerInvestorService: StockHourForeignerInvestorService,
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

    @OnQueueProcessor(StockCrawlerFlowType.RequestStockHourInvestorByForeigner)
    async processRequestStockHourInvestorByForeigner(
        job: Job<{
            date: string;
            stock: Stock;
        }>,
    ) {
        try {
            const { date, stock } = job.data;
            const currentDate = new Date(date);
            const childrenResponses =
                await this.koreaInvestmentRequestApiHelper.getChildMultiResponses<
                    DomesticStockInvestorTrendEstimateParam,
                    unknown,
                    DomesticStockInvestorTrendEstimateOutput2[]
                >(job);

            const outputs = childrenResponses.flatMap(
                ({ response }) => response.output2,
            );

            const transformer = new StockInvestorByEstimateTransformer();

            const stockHourForeignerInvestorDtoList = outputs.map((output) =>
                transformer.transform({
                    stock,
                    output,
                }),
            );

            for (const dto of stockHourForeignerInvestorDtoList) {
                const dateYmd = toDateYmdByDate({
                    date: currentDate,
                    separator: '-',
                });

                const isExists =
                    await this.stockHourForeignerInvestorService.exists(
                        dto.stockCode,
                        dateYmd,
                        dto.timeCode,
                    );
                if (isExists) {
                    continue;
                }

                await this.stockHourForeignerInvestorService.insert({
                    ...dto,
                    date: dateYmd,
                    stockCode: stock.shortCode,
                });
            }
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
