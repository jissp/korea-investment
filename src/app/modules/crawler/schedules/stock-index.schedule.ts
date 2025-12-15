import { FlowProducer } from 'bullmq';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { getDefaultJobOptions } from '@modules/queue';
import { KoreaInvestmentHelperService } from '@modules/korea-investment/korea-investment-helper';
import {
    DomesticStockQuotationInquireIndexPriceParam,
    OverseasQuotationInquireDailyChartPriceParam,
} from '@modules/korea-investment/korea-investment-quotation-client';
import {
    CrawlerFlowType,
    CrawlerQueueType,
    KoreaInvestmentCallApiParam,
} from '../crawler.types';

@Injectable()
export class StockIndexSchedule implements OnModuleInit {
    private readonly logger: Logger = new Logger(StockIndexSchedule.name);

    constructor(
        private readonly helper: KoreaInvestmentHelperService,
        @Inject(CrawlerFlowType.RequestKoreaIndex)
        private readonly requestKoreaIndexFlow: FlowProducer,
        @Inject(CrawlerFlowType.RequestOverseasIndex)
        private readonly requestOverseasIndexFlow: FlowProducer,
    ) {}

    onModuleInit() {
        this.handleCrawlingKoreaIndex();
        this.handleCrawlingOverseasIndex();
    }

    @Cron('*/1 * * * *')
    async handleCrawlingKoreaIndex() {
        try {
            await this.requestKoreaIndexFlow.add(
                {
                    name: CrawlerFlowType.RequestKoreaIndex,
                    queueName: CrawlerFlowType.RequestKoreaIndex,
                    children: ['0001', '1001'].map((iscd) => ({
                        name: CrawlerQueueType.RequestKoreaInvestmentApi,
                        queueName: CrawlerQueueType.RequestKoreaInvestmentApi,
                        data: {
                            url: '/uapi/domestic-stock/v1/quotations/inquire-index-price',
                            tradeId: 'FHPUP02100000',
                            params: {
                                FID_COND_MRKT_DIV_CODE: 'U',
                                FID_INPUT_ISCD: iscd,
                            },
                        } as KoreaInvestmentCallApiParam<DomesticStockQuotationInquireIndexPriceParam>,
                    })),
                },
                {
                    queuesOptions: {
                        [CrawlerFlowType.RequestKoreaIndex]: {
                            defaultJobOptions: getDefaultJobOptions(),
                        },
                        [CrawlerQueueType.RequestKoreaInvestmentApi]: {
                            defaultJobOptions: getDefaultJobOptions(),
                        },
                    },
                },
            );
        } catch (error) {
            this.logger.error(error);
        }
    }

    @Cron('*/1 * * * *')
    async handleCrawlingOverseasIndex() {
        try {
            const currentDate = new Date();

            await this.requestOverseasIndexFlow.add(
                {
                    name: CrawlerFlowType.RequestOverseasIndex,
                    queueName: CrawlerFlowType.RequestOverseasIndex,
                    children: ['.DJI', 'COMP', 'SPX', 'SOX'].map((iscd) => ({
                        name: CrawlerQueueType.RequestKoreaInvestmentApi,
                        queueName: CrawlerQueueType.RequestKoreaInvestmentApi,
                        data: {
                            url: '/uapi/overseas-price/v1/quotations/inquire-daily-chartprice',
                            tradeId: 'FHKST03030100',
                            params: {
                                FID_COND_MRKT_DIV_CODE: 'N',
                                FID_INPUT_ISCD: iscd,
                                FID_INPUT_DATE_1:
                                    this.helper.formatDateParam(currentDate),
                                FID_INPUT_DATE_2:
                                    this.helper.formatDateParam(currentDate),
                                FID_PERIOD_DIV_CODE: 'D',
                            },
                        } as KoreaInvestmentCallApiParam<OverseasQuotationInquireDailyChartPriceParam>,
                    })),
                },
                {
                    queuesOptions: {
                        [CrawlerFlowType.RequestOverseasIndex]: {
                            defaultJobOptions: getDefaultJobOptions(),
                        },
                        [CrawlerQueueType.RequestKoreaInvestmentApi]: {
                            defaultJobOptions: getDefaultJobOptions(),
                        },
                    },
                },
            );
        } catch (error) {
            this.logger.error(error);
        }
    }
}
