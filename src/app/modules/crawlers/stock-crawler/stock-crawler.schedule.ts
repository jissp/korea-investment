import { FlowProducer } from 'bullmq';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { uniqueValues } from '@common/utils';
import { PreventConcurrentExecution } from '@common/decorators';
import { getDefaultJobOptions } from '@modules/queue';
import { MarketDivCode } from '@modules/korea-investment/common';
import { KoreaInvestmentHelperService } from '@modules/korea-investment/korea-investment-helper';
import { DomesticStockQuotationsInquireInvestorParam } from '@modules/korea-investment/korea-investment-quotation-client';
import {
    KoreaInvestmentRequestApiHelper,
    KoreaInvestmentRequestApiType,
} from '@app/modules/korea-investment-request-api';
import { FavoriteStockService } from '@app/modules/repositories/favorite-stock';
import { StockCrawlerFlowType } from './stock-crawler.types';

@Injectable()
export class StockCrawlerSchedule implements OnModuleInit {
    private readonly logger = new Logger(StockCrawlerSchedule.name);

    constructor(
        private readonly requestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly favoriteStockService: FavoriteStockService,
        private readonly koreaInvestmentHelperService: KoreaInvestmentHelperService,
        @Inject(StockCrawlerFlowType.RequestDailyItemChartPrice)
        private readonly requestDailyItemChartPriceFlow: FlowProducer,
        @Inject(StockCrawlerFlowType.RequestStockInvestor)
        private readonly requestStockInvestorFlow: FlowProducer,
    ) {}

    onModuleInit() {
        // this.handleCrawlingStockInvestor();
        this.handleCrawlingStockDailyItemChartPrice();
    }

    @Cron('0 16 * * *') // 매일 16시에 실행 (장 마감 후)
    @PreventConcurrentExecution()
    async handleCrawlingStockInvestor() {
        // 임시로 처리 안함.
        return;

        try {
            const favoriteStocks = await this.favoriteStockService.findAll();
            const stockCodes = uniqueValues(
                favoriteStocks.map((favoriteStock) => favoriteStock.stockCode),
            );

            const queueName = StockCrawlerFlowType.RequestStockInvestor;
            await this.requestStockInvestorFlow.add(
                {
                    name: queueName,
                    queueName: queueName,
                    children: stockCodes.map((stockCode) => {
                        return this.requestApiHelper.generateRequestApi<DomesticStockQuotationsInquireInvestorParam>(
                            {
                                url: '/uapi/domestic-stock/v1/quotations/inquire-investor',
                                tradeId: 'FHKST01010900',
                                params: {
                                    FID_COND_MRKT_DIV_CODE: MarketDivCode.KRX,
                                    FID_INPUT_ISCD: stockCode,
                                },
                            },
                        );
                    }),
                },
                {
                    queuesOptions: {
                        [queueName]: {
                            defaultJobOptions: getDefaultJobOptions(),
                        },
                        [KoreaInvestmentRequestApiType]: {
                            defaultJobOptions: getDefaultJobOptions(),
                        },
                    },
                },
            );
        } catch (error) {
            this.logger.error(error);
        }
    }

    @Cron('00 */1 * * *')
    async handleCrawlingStockDailyItemChartPrice() {
        try {
            // const favoriteStocks = await this.favoriteStockService.findAll();
            // const stockCodes = uniqueValues(
            //     favoriteStocks.map((favoriteStock) => favoriteStock.stockCode),
            // );
            //
            // const currentDate = new Date();
            // const fromDate = new Date(currentDate);
            // fromDate.setDate(currentDate.getDate() - 90);
            //
            // const queueName = StockCrawlerFlowType.RequestDailyItemChartPrice;
            // await Promise.all(
            //     stockCodes.map((stockCode) => {
            //         return this.requestDailyItemChartPriceFlow.add(
            //             {
            //                 name: queueName,
            //                 queueName,
            //                 data: {
            //                     stockCode,
            //                 },
            //                 children: [
            //                     {
            //                         name: KoreaInvestmentRequestApiType,
            //                         queueName: KoreaInvestmentRequestApiType,
            //                         data: {
            //                             url: '/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice',
            //                             tradeId: 'FHKST03010100',
            //                             params: {
            //                                 FID_COND_MRKT_DIV_CODE:
            //                                     getCurrentMarketDivCode() ||
            //                                     MarketDivCode.KRX,
            //                                 FID_INPUT_ISCD: stockCode,
            //                                 FID_PERIOD_DIV_CODE: 'D',
            //                                 FID_ORG_ADJ_PRC: '1',
            //                                 FID_INPUT_DATE_1:
            //                                     this.koreaInvestmentHelperService.formatDateParam(
            //                                         fromDate,
            //                                     ),
            //                                 FID_INPUT_DATE_2:
            //                                     this.koreaInvestmentHelperService.formatDateParam(
            //                                         currentDate,
            //                                     ),
            //                             },
            //                         } as KoreaInvestmentCallApiParam<DomesticStockQuotationsInquireDailyItemChartPriceParam>,
            //                     },
            //                 ],
            //             },
            //             {
            //                 queuesOptions: {
            //                     [queueName]: {
            //                         defaultJobOptions: getDefaultJobOptions(),
            //                     },
            //                     [KoreaInvestmentRequestApiType]: {
            //                         defaultJobOptions: getDefaultJobOptions(),
            //                     },
            //                 },
            //             },
            //         );
            //     }),
            // );
        } catch (error) {
            this.logger.error(error);
        }
    }
}
