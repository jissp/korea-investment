import { FlowProducer } from 'bullmq';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PreventConcurrentExecution } from '@common/decorators';
import { getDefaultJobOptions } from '@modules/queue';
import { KoreaInvestmentHelperService } from '@modules/korea-investment/korea-investment-helper';
import {
    KoreaInvestmentRequestApiHelper,
    KoreaInvestmentRequestApiType,
} from '@app/modules/korea-investment-request-api';
import {
    DOMESTIC_INDEX_CODES,
    KoreaInvestmentIndexCrawlerFlowType,
    OVERSEAS_GOVERNMENT_BOND_CODES,
    OVERSEAS_INDEX_CODES,
} from './korea-investment-index-crawler.types';
import {
    KoreaInvestmentDomesticInquireIndexDailyPriceParam,
    OverseasQuotationInquireDailyChartPriceParam,
} from './korea-investment-index-crawler.interface';

@Injectable()
export class KoreaInvestmentIndexCrawlerSchedule implements OnModuleInit {
    private readonly logger = new Logger(
        KoreaInvestmentIndexCrawlerSchedule.name,
    );

    constructor(
        private readonly helperService: KoreaInvestmentHelperService,
        private readonly requestApiHelper: KoreaInvestmentRequestApiHelper,
        @Inject(KoreaInvestmentIndexCrawlerFlowType.RequestKoreaDailyIndex)
        private readonly requestKoreaDailyIndexFlow: FlowProducer,
        @Inject(KoreaInvestmentIndexCrawlerFlowType.RequestOverseasIndex)
        private readonly requestOverseasIndexFlow: FlowProducer,
        @Inject(
            KoreaInvestmentIndexCrawlerFlowType.RequestOverseasGovernmentBond,
        )
        private readonly requestOverseasGovernmentBond: FlowProducer,
    ) {}

    onModuleInit() {
        this.handleCrawlingKoreaDailyIndex();
        this.handleCrawlingOverseasIndex();
        this.handleCrawlingOverseasGovernmentBond();
    }

    @Cron('*/3 * * * *')
    @PreventConcurrentExecution()
    async handleCrawlingKoreaDailyIndex() {
        const fromDate = new Date();

        const queueName =
            KoreaInvestmentIndexCrawlerFlowType.RequestKoreaDailyIndex;
        await this.requestKoreaDailyIndexFlow.add(
            {
                name: queueName,
                queueName,
                children: DOMESTIC_INDEX_CODES.map(({ code }) => {
                    return this.requestApiHelper.generateRequestApi<KoreaInvestmentDomesticInquireIndexDailyPriceParam>(
                        {
                            url: '/uapi/domestic-stock/v1/quotations/inquire-index-daily-price',
                            tradeId: 'FHPUP02120000',
                            params: {
                                FID_COND_MRKT_DIV_CODE: 'U',
                                FID_INPUT_ISCD: code,
                                FID_PERIOD_DIV_CODE: 'D',
                                FID_INPUT_DATE_1:
                                    this.helperService.formatDateParam(
                                        fromDate,
                                    ),
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
    }

    @Cron('*/5 * * * *')
    @PreventConcurrentExecution()
    async handleCrawlingOverseasIndex() {
        try {
            const currentDate = new Date();
            const fromDate = new Date();
            fromDate.setDate(currentDate.getDate() - 90);

            const queueName =
                KoreaInvestmentIndexCrawlerFlowType.RequestOverseasIndex;
            await this.requestOverseasIndexFlow.add(
                {
                    name: queueName,
                    queueName: queueName,
                    children: OVERSEAS_INDEX_CODES.map(({ code }) => {
                        return this.requestApiHelper.generateRequestApi<OverseasQuotationInquireDailyChartPriceParam>(
                            {
                                url: '/uapi/overseas-price/v1/quotations/inquire-daily-chartprice',
                                tradeId: 'FHKST03030100',
                                params: {
                                    FID_COND_MRKT_DIV_CODE: 'N',
                                    FID_INPUT_ISCD: code,
                                    FID_INPUT_DATE_1:
                                        this.helperService.formatDateParam(
                                            fromDate,
                                        ),
                                    FID_INPUT_DATE_2:
                                        this.helperService.formatDateParam(
                                            currentDate,
                                        ),
                                    FID_PERIOD_DIV_CODE: 'D',
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

    @Cron('*/10 * * * *')
    @PreventConcurrentExecution()
    async handleCrawlingOverseasGovernmentBond() {
        try {
            const currentDate = new Date();
            const fromDate = new Date();
            fromDate.setDate(currentDate.getDate() - 90);

            const queueName =
                KoreaInvestmentIndexCrawlerFlowType.RequestOverseasGovernmentBond;
            await this.requestOverseasGovernmentBond.add(
                {
                    name: queueName,
                    queueName: queueName,
                    children: OVERSEAS_GOVERNMENT_BOND_CODES.map(({ code }) => {
                        return this.requestApiHelper.generateRequestApi<OverseasQuotationInquireDailyChartPriceParam>(
                            {
                                url: '/uapi/overseas-price/v1/quotations/inquire-daily-chartprice',
                                tradeId: 'FHKST03030100',
                                params: {
                                    FID_COND_MRKT_DIV_CODE: 'I',
                                    FID_INPUT_ISCD: code,
                                    FID_INPUT_DATE_1:
                                        this.helperService.formatDateParam(
                                            fromDate,
                                        ),
                                    FID_INPUT_DATE_2:
                                        this.helperService.formatDateParam(
                                            currentDate,
                                        ),
                                    FID_PERIOD_DIV_CODE: 'D',
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
}
