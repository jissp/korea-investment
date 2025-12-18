import { FlowProducer } from 'bullmq';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { getCurrentMarketDivCode } from '@common/domains';
import { getDefaultJobOptions } from '@modules/queue';
import { MarketDivCode } from '@modules/korea-investment/common';
import { KoreaInvestmentHelperService } from '@modules/korea-investment/korea-investment-helper';
import { DomesticStockQuotationsInquireDailyItemChartPriceParam } from '@modules/korea-investment/korea-investment-quotation-client';
import {
    KoreaInvestmentSettingHelperService,
    KoreaInvestmentSettingKey,
} from '@app/modules/korea-investment-setting';
import {
    KoreaInvestmentCallApiParam,
    KoreaInvestmentRequestApiType,
} from '@app/modules/korea-investment-request-api';
import { CrawlerFlowType } from '../crawler.types';

@Injectable()
export class ChartSchedule implements OnModuleInit {
    private readonly logger: Logger = new Logger(ChartSchedule.name);

    constructor(
        private readonly koreaInvestmentSettingHelperService: KoreaInvestmentSettingHelperService,
        private readonly helper: KoreaInvestmentHelperService,
        @Inject(CrawlerFlowType.RequestDailyItemChartPrice)
        private readonly requestDailyItemChartPriceFlow: FlowProducer,
    ) {}

    onModuleInit() {
        this.handleCrawlingStockDailyItemChartPrice();
    }

    @Cron('00 */1 * * *')
    async handleCrawlingStockDailyItemChartPrice() {
        try {
            const stockCodes = await this.koreaInvestmentSettingHelperService
                .getSettingSet(KoreaInvestmentSettingKey.StockCodes)
                .list();

            const currentDate = new Date();
            const fromDate = new Date(currentDate);
            fromDate.setDate(currentDate.getDate() - 90);

            await Promise.all(
                stockCodes.map((stockCode) => {
                    return this.requestDailyItemChartPriceFlow.add(
                        {
                            name: CrawlerFlowType.RequestDailyItemChartPrice,
                            queueName:
                                CrawlerFlowType.RequestDailyItemChartPrice,
                            data: {
                                stockCode,
                            },
                            children: [
                                {
                                    name: KoreaInvestmentRequestApiType,
                                    queueName: KoreaInvestmentRequestApiType,
                                    data: {
                                        url: '/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice',
                                        tradeId: 'FHKST03010100',
                                        params: {
                                            FID_COND_MRKT_DIV_CODE:
                                                getCurrentMarketDivCode() ||
                                                MarketDivCode.KRX,
                                            FID_INPUT_ISCD: stockCode,
                                            FID_PERIOD_DIV_CODE: 'D',
                                            FID_ORG_ADJ_PRC: '1',
                                            FID_INPUT_DATE_1:
                                                this.helper.formatDateParam(
                                                    fromDate,
                                                ),
                                            FID_INPUT_DATE_2:
                                                this.helper.formatDateParam(
                                                    currentDate,
                                                ),
                                        },
                                    } as KoreaInvestmentCallApiParam<DomesticStockQuotationsInquireDailyItemChartPriceParam>,
                                },
                            ],
                        },
                        {
                            queuesOptions: {
                                [CrawlerFlowType.RequestDailyItemChartPrice]: {
                                    defaultJobOptions: getDefaultJobOptions(),
                                },
                                [KoreaInvestmentRequestApiType]: {
                                    defaultJobOptions: getDefaultJobOptions(),
                                },
                            },
                        },
                    );
                }),
            );
        } catch (error) {
            this.logger.error(error);
        }
    }
}
