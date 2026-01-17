import * as _ from 'lodash';
import { FlowProducer } from 'bullmq';
import { FlowJob } from 'bullmq/dist/esm/interfaces';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { toDateYmdByDate, toTimeCodeByDate } from '@common/utils';
import { PreventConcurrentExecution } from '@common/decorators';
import { getCurrentMarketDivCode } from '@common/domains';
import { getDefaultJobOptions } from '@modules/queue';
import { MarketDivCode } from '@modules/korea-investment/common';
import { YN } from '@app/common';
import {
    KoreaInvestmentRequestApiHelper,
    KoreaInvestmentRequestApiType,
} from '@app/modules/korea-investment-request-api/common';
import { KoreaInvestmentHolidayService } from '@app/modules/repositories/korea-investment-holiday';
import { Stock } from '@app/modules/repositories/stock';
import { StockCrawlerFlowType } from './stock-crawler.types';
import { StockCrawlerService } from './stock-crawler.service';

@Injectable()
export class StockCrawlerSchedule implements OnModuleInit {
    private readonly logger = new Logger(StockCrawlerSchedule.name);

    constructor(
        private readonly requestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly koreaInvestmentHolidayService: KoreaInvestmentHolidayService,
        private readonly stockCrawlerService: StockCrawlerService,
        @Inject(StockCrawlerFlowType.RequestStockHourInvestorByForeigner)
        private readonly requestStockHourInvestorByForeignerFlow: FlowProducer,
        @Inject(StockCrawlerFlowType.RequestStockInvestor)
        private readonly requestStockInvestorFlow: FlowProducer,
        @Inject(StockCrawlerFlowType.UpdateAccountStockGroupStockPrices)
        private readonly updateAccountStockGroupStockPricesFlow: FlowProducer,
    ) {}

    onModuleInit() {
        this.handleCrawlingStockInvestor();
        this.handleCrawlingStockHourInvestorByForeigner();
        this.handleUpdateAccountStockGroupStockPrices();
    }

    @Cron('*/5 * * * *') // 매일 16시에 실행 (장 마감 후)
    @PreventConcurrentExecution()
    async handleCrawlingStockInvestor() {
        const currentDate = new Date();
        const hour = currentDate.getHours();

        if (hour < 9) {
            currentDate.setDate(currentDate.getDate() - 1);
        }

        const todayYmd = toDateYmdByDate({
            date: currentDate,
            separator: '-',
        });

        const latestBusinessDay =
            await this.koreaInvestmentHolidayService.getLatestBusinessDayByDate(
                todayYmd,
            );

        if (!latestBusinessDay) {
            throw new Error('Latest business day not found');
        }

        const stocks =
            await this.stockCrawlerService.getStocksForCrawlingStockInvestor(
                latestBusinessDay.date,
            );

        const queueName = StockCrawlerFlowType.RequestStockInvestor;

        const flowOptions = {
            queuesOptions: {
                [queueName]: {
                    defaultJobOptions: getDefaultJobOptions(),
                },
                [KoreaInvestmentRequestApiType.Additional]: {
                    defaultJobOptions: getDefaultJobOptions(),
                },
            },
        };
        const stockFlowJobs = stocks.map(
            (stock): FlowJob => ({
                name: queueName,
                queueName,
                children: [
                    this.requestApiHelper.generateDomesticInvestor({
                        FID_INPUT_ISCD: stock.shortCode,
                        FID_COND_MRKT_DIV_CODE:
                            stock.isNextTrade === YN.Y
                                ? MarketDivCode.통합
                                : MarketDivCode.KRX,
                    }),
                ],
            }),
        );
        await Promise.all(
            stockFlowJobs.map((stockFlowJob) =>
                this.requestStockInvestorFlow.add(stockFlowJob, flowOptions),
            ),
        );
    }

    // @Cron('*/5 * * * *') // 매일 16시에 실행 (장 마감 후)
    @PreventConcurrentExecution()
    async handleCrawlingStockHourInvestorByForeigner() {
        const currentDate = new Date();

        const timeCode = toTimeCodeByDate(currentDate);
        if (isNil(timeCode)) {
            return;
        }

        const todayYmd = toDateYmdByDate({
            date: currentDate,
            separator: '-',
        });

        const latestBusinessDay =
            await this.koreaInvestmentHolidayService.getLatestBusinessDayByDate(
                todayYmd,
            );

        if (!latestBusinessDay) {
            throw new Error('Latest business day not found');
        }

        if (latestBusinessDay.isOpen === YN.N) {
            return;
        }

        const stocks =
            await this.stockCrawlerService.getStocksForRequestStockHourInvestorByForeigner(
                latestBusinessDay.date,
                timeCode,
            );

        const queueName =
            StockCrawlerFlowType.RequestStockHourInvestorByForeigner;

        const flowOptions = {
            queuesOptions: {
                [queueName]: {
                    defaultJobOptions: getDefaultJobOptions(),
                },
                [KoreaInvestmentRequestApiType.Additional]: {
                    defaultJobOptions: getDefaultJobOptions(),
                },
            },
        };
        const stockFlowJobs = stocks.map(
            (stock): FlowJob => ({
                name: queueName,
                queueName,
                data: {
                    date: currentDate.toISOString(),
                    stock,
                },
                children: [
                    this.requestApiHelper.generateDomesticInvestorByEstimate({
                        MKSC_SHRN_ISCD: stock.shortCode,
                    }),
                ],
            }),
        );
        await Promise.all(
            stockFlowJobs.map((stockFlowJob) =>
                this.requestStockHourInvestorByForeignerFlow.add(
                    stockFlowJob,
                    flowOptions,
                ),
            ),
        );
    }

    @Cron('*/10 * * * * *')
    @PreventConcurrentExecution()
    async handleUpdateAccountStockGroupStockPrices() {
        try {
            const marketDivCode = getCurrentMarketDivCode();
            if (isNil(marketDivCode)) {
                return;
            }

            const stocks =
                await this.stockCrawlerService.getStocksForUpdateAccountStockGroupStockPrices();

            const groupedStocks = _.groupBy(
                stocks,
                (stock: Stock) => stock.isNextTrade,
            );

            const queueName =
                StockCrawlerFlowType.UpdateAccountStockGroupStockPrices;
            for (const [isNextTrade, stocks] of Object.entries(
                groupedStocks,
            ) as [YN, Stock[]][]) {
                _.chunk(stocks, 30).map((stocks) => {
                    const stockCodes = stocks.map((stock) => stock.shortCode);

                    return this.updateAccountStockGroupStockPricesFlow.add(
                        {
                            name: queueName,
                            queueName,
                            children: [
                                this.requestApiHelper.generateRequestApiForIntstockMultiPrice(
                                    isNextTrade === YN.Y
                                        ? MarketDivCode.통합
                                        : MarketDivCode.KRX,
                                    stockCodes,
                                ),
                            ],
                        },
                        {
                            queuesOptions: {
                                [queueName]: {
                                    defaultJobOptions: getDefaultJobOptions(),
                                },
                                [KoreaInvestmentRequestApiType.Additional]: {
                                    defaultJobOptions: getDefaultJobOptions(),
                                },
                            },
                        },
                    );
                });
            }
        } catch (error) {
            this.logger.error(error);
        }
    }
}
