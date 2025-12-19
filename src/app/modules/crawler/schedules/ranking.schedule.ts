import { FlowProducer } from 'bullmq';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { getCurrentMarketDivCode } from '@common/domains';
import { getDefaultJobOptions } from '@modules/queue';
import { MarketDivCode } from '@modules/korea-investment/common';
import { DomesticStockQuotationVolumeRankParam } from '@modules/korea-investment/korea-investment-rank-client';
import {
    KoreaInvestmentCallApiParam,
    KoreaInvestmentRequestApiType,
} from '@app/modules/korea-investment-request-api';
import { CrawlerFlowType } from '../crawler.types';

@Injectable()
export class RankingSchedule implements OnModuleInit {
    private readonly logger: Logger = new Logger(RankingSchedule.name);

    constructor(
        @Inject(CrawlerFlowType.RequestDomesticHtsTopView)
        private readonly requestDomesticHtsTopViewFlow: FlowProducer,
        @Inject(CrawlerFlowType.RequestDomesticVolumeRank)
        private readonly requestDomesticVolumeRankFlow: FlowProducer,
    ) {}

    onModuleInit() {
        this.handleCrawlingKoreaInvestmentHtsTopView();
        this.handleCrawlingKoreaInvestmentVolumeRank();
    }

    @Cron('*/30 * * * * *')
    async handleCrawlingKoreaInvestmentHtsTopView() {
        try {
            await this.requestDomesticHtsTopViewFlow.add(
                {
                    name: CrawlerFlowType.RequestDomesticHtsTopView,
                    queueName: CrawlerFlowType.RequestDomesticHtsTopView,
                    children: [
                        {
                            name: KoreaInvestmentRequestApiType,
                            queueName: KoreaInvestmentRequestApiType,
                            data: {
                                url: '/uapi/domestic-stock/v1/ranking/hts-top-view',
                                tradeId: 'HHMCM000100C0',
                                params: undefined,
                            } as KoreaInvestmentCallApiParam<undefined>,
                        },
                    ],
                },
                {
                    queuesOptions: {
                        [CrawlerFlowType.RequestDomesticHtsTopView]: {
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

    @Cron('*/30 * * * * *')
    async handleCrawlingKoreaInvestmentVolumeRank() {
        try {
            await this.requestDomesticVolumeRankFlow.add(
                {
                    name: CrawlerFlowType.RequestDomesticVolumeRank,
                    queueName: CrawlerFlowType.RequestDomesticVolumeRank,
                    children: [
                        {
                            name: KoreaInvestmentRequestApiType,
                            queueName: KoreaInvestmentRequestApiType,
                            data: {
                                url: '/uapi/domestic-stock/v1/quotations/volume-rank',
                                tradeId: 'FHPST01710000',
                                params: {
                                    FID_COND_MRKT_DIV_CODE:
                                        getCurrentMarketDivCode() ||
                                        MarketDivCode.KRX,
                                    FID_COND_SCR_DIV_CODE: '20171',
                                    FID_INPUT_ISCD: '0000',
                                    FID_DIV_CLS_CODE: '1',
                                    FID_BLNG_CLS_CODE: '0',
                                    FID_TRGT_CLS_CODE: '000000000',
                                    FID_TRGT_EXLS_CLS_CODE: '000000000',
                                    FID_INPUT_PRICE_1: '',
                                    FID_INPUT_PRICE_2: '',
                                    FID_VOL_CNT: '',
                                    FID_INPUT_DATE_1: '',
                                },
                            } as KoreaInvestmentCallApiParam<DomesticStockQuotationVolumeRankParam>,
                        },
                    ],
                },
                {
                    queuesOptions: {
                        [CrawlerFlowType.RequestDomesticVolumeRank]: {
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
