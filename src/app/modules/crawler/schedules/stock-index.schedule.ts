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

    private readonly DOMESTIC_INDEX_CODES = [
        {
            code: '0001',
            name: '코스피',
        },
        {
            code: '1001',
            name: '코스닥',
        },
    ];

    private readonly OVERSEAS_INDEX_CODES = [
        {
            code: '.DJI',
            name: '다우존스 산업지수',
        },
        {
            code: 'COMP',
            name: '나스닥 종합',
        },
        {
            code: 'SPX',
            name: 'S&P500',
        },
        {
            code: 'SOX',
            name: '필라델피아 반도체지수',
        },
    ];

    private readonly GOVERNMENT_BOND_CODES = [
        { code: 'Y0104', name: '국고채 1년' },
        { code: 'Y0101', name: '국고채 3년' },
        { code: 'Y0105', name: '국고채 5년' },
        { code: 'Y0106', name: '국고채 10년' },
    ];

    constructor(
        private readonly helper: KoreaInvestmentHelperService,
        @Inject(CrawlerFlowType.RequestKoreaIndex)
        private readonly requestKoreaIndexFlow: FlowProducer,
        @Inject(CrawlerFlowType.RequestOverseasIndex)
        private readonly requestOverseasIndexFlow: FlowProducer,
        @Inject(CrawlerFlowType.RequestOverseasGovernmentBond)
        private readonly requestOverseasGovernmentBond: FlowProducer,
    ) {}

    onModuleInit() {
        this.handleCrawlingKoreaIndex();
        this.handleCrawlingOverseasIndex();
        this.handleCrawlingOverseasGovernmentBond();
    }

    @Cron('*/1 * * * *')
    async handleCrawlingKoreaIndex() {
        try {
            const codes = this.DOMESTIC_INDEX_CODES.map((code) => code.code);

            await this.requestKoreaIndexFlow.add(
                {
                    name: CrawlerFlowType.RequestKoreaIndex,
                    queueName: CrawlerFlowType.RequestKoreaIndex,
                    children: this.DOMESTIC_INDEX_CODES.map(({ code }) => ({
                        name: CrawlerQueueType.RequestKoreaInvestmentApi,
                        queueName: CrawlerQueueType.RequestKoreaInvestmentApi,
                        data: {
                            url: '/uapi/domestic-stock/v1/quotations/inquire-index-price',
                            tradeId: 'FHPUP02100000',
                            params: {
                                FID_COND_MRKT_DIV_CODE: 'U',
                                FID_INPUT_ISCD: code,
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
                    children: this.OVERSEAS_INDEX_CODES.map(
                        ({ code, name }) => ({
                            name: CrawlerQueueType.RequestKoreaInvestmentApi,
                            queueName:
                                CrawlerQueueType.RequestKoreaInvestmentApi,
                            data: {
                                url: '/uapi/overseas-price/v1/quotations/inquire-daily-chartprice',
                                tradeId: 'FHKST03030100',
                                params: {
                                    FID_COND_MRKT_DIV_CODE: 'N',
                                    FID_INPUT_ISCD: code,
                                    FID_INPUT_DATE_1:
                                        this.helper.formatDateParam(
                                            currentDate,
                                        ),
                                    FID_INPUT_DATE_2:
                                        this.helper.formatDateParam(
                                            currentDate,
                                        ),
                                    FID_PERIOD_DIV_CODE: 'D',
                                },
                            } as KoreaInvestmentCallApiParam<OverseasQuotationInquireDailyChartPriceParam>,
                        }),
                    ),
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

    @Cron('*/10 * * * *')
    async handleCrawlingOverseasGovernmentBond() {
        try {
            const currentDate = new Date();
            const fromDate = new Date();
            fromDate.setDate(currentDate.getDate() - 90);

            await this.requestOverseasGovernmentBond.add(
                {
                    name: CrawlerFlowType.RequestOverseasGovernmentBond,
                    queueName: CrawlerFlowType.RequestOverseasGovernmentBond,
                    children: this.GOVERNMENT_BOND_CODES.map(
                        ({ code, name }) => ({
                            name: CrawlerQueueType.RequestKoreaInvestmentApi,
                            queueName:
                                CrawlerQueueType.RequestKoreaInvestmentApi,
                            data: {
                                url: '/uapi/overseas-price/v1/quotations/inquire-daily-chartprice',
                                tradeId: 'FHKST03030100',
                                params: {
                                    FID_COND_MRKT_DIV_CODE: 'I',
                                    FID_INPUT_ISCD: code,
                                    FID_INPUT_DATE_1:
                                        this.helper.formatDateParam(fromDate),
                                    FID_INPUT_DATE_2:
                                        this.helper.formatDateParam(
                                            currentDate,
                                        ),
                                    FID_PERIOD_DIV_CODE: 'D',
                                },
                            } as KoreaInvestmentCallApiParam<OverseasQuotationInquireDailyChartPriceParam>,
                        }),
                    ),
                },
                {
                    queuesOptions: {
                        [CrawlerFlowType.RequestOverseasGovernmentBond]: {
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
