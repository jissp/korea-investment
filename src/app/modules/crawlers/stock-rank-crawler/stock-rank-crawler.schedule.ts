import { FlowProducer } from 'bullmq';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { getCurrentMarketDivCode } from '@common/domains';
import { getDefaultJobOptions } from '@modules/queue';
import { MarketDivCode } from '@modules/korea-investment/common';
import {
    KoreaInvestmentRequestApiHelper,
    KoreaInvestmentRequestApiType,
} from '@app/modules/korea-investment-request-api';
import { StockRankCrawlerFlowType } from './stock-rank-crawler.types';

@Injectable()
export class StockRankCrawlerSchedule implements OnModuleInit {
    private readonly logger: Logger = new Logger(StockRankCrawlerSchedule.name);

    constructor(
        private readonly koreaInvestmentRequestApiHelper: KoreaInvestmentRequestApiHelper,
        @Inject(StockRankCrawlerFlowType.RequestHtsTopViews)
        private readonly requestHtsTopViewsFlow: FlowProducer,
        @Inject(StockRankCrawlerFlowType.RequestVolumeRanks)
        private readonly requestVolumeRankFlow: FlowProducer,
    ) {}

    onModuleInit() {
        this.handleRequestPopulatedHtsTopView();
        this.handleCrawlingKoreaInvestmentVolumeRank();
    }

    @Cron('*/30 * * * * *')
    async handleRequestPopulatedHtsTopView() {
        try {
            const queueName = StockRankCrawlerFlowType.RequestHtsTopViews;
            await this.requestHtsTopViewsFlow.add(
                {
                    name: queueName,
                    queueName,
                    children: [
                        this.koreaInvestmentRequestApiHelper.generateRequestApiForRankingHtsTopView(),
                    ],
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

    @Cron('*/30 * * * * *')
    async handleCrawlingKoreaInvestmentVolumeRank() {
        try {
            const queueName = StockRankCrawlerFlowType.RequestVolumeRanks;
            await this.requestVolumeRankFlow.add(
                {
                    name: queueName,
                    queueName,
                    children: [
                        this.koreaInvestmentRequestApiHelper.generateRequestApiForRankingVolume(
                            {
                                marketDivCode:
                                    getCurrentMarketDivCode() ||
                                    MarketDivCode.KRX,
                            },
                        ),
                    ],
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
