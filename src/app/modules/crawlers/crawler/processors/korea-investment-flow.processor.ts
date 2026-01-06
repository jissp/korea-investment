import * as _ from 'lodash';
import { FlowProducer, Job } from 'bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getDefaultJobOptions, OnQueueProcessor } from '@modules/queue';
import { StockRepository } from '@app/modules/repositories/stock-repository';
import {
    DomesticStockQuotationVolumeRankOutput,
    DomesticStockRankingHtsTopViewOutput,
} from '@modules/korea-investment/korea-investment-rank-client';
import { DomesticStockQuotationsIntstockMultPriceOutput } from '@modules/korea-investment/korea-investment-quotation-client';
import {
    KoreaInvestmentRequestApiHelper,
    KoreaInvestmentRequestApiType,
} from '@app/modules/korea-investment-request-api';
import { CrawlerFlowType } from '../crawler.types';

@Injectable()
export class KoreaInvestmentFlowProcessor {
    private readonly logger: Logger = new Logger(
        KoreaInvestmentFlowProcessor.name,
    );

    constructor(
        private readonly stockRepository: StockRepository,
        private readonly koreaInvestmentRequestApiHelper: KoreaInvestmentRequestApiHelper,
        @Inject(CrawlerFlowType.RequestRefreshPopulatedVolumeRank)
        private readonly requestRefreshPopulatedVolumeRankFlow: FlowProducer,
        @Inject(CrawlerFlowType.RequestRefreshPopulatedHtsTopView)
        private readonly requestRefreshPopulatedHtsTopViewFlow: FlowProducer,
    ) {}

    @OnQueueProcessor(CrawlerFlowType.RequestDomesticHtsTopView)
    async processRequestDomesticHtsTopView(job: Job) {
        try {
            const childrenResponses =
                await this.koreaInvestmentRequestApiHelper.getChildMultiResponses<
                    any,
                    DomesticStockRankingHtsTopViewOutput[]
                >(job);
            const childrenResults = childrenResponses.flatMap(
                ({ response }) => response.output1,
            );

            await this.stockRepository.setHtsTopView(childrenResults);

            await this.requestRefreshPopulatedHtsTopViewFlow.add(
                {
                    name: CrawlerFlowType.RequestRefreshPopulatedHtsTopView,
                    queueName:
                        CrawlerFlowType.RequestRefreshPopulatedHtsTopView,
                    children: [
                        this.koreaInvestmentRequestApiHelper.generateRequestApiForIntstockMultiPrice(
                            childrenResults.map(
                                (childrenResult) =>
                                    childrenResult.mksc_shrn_iscd,
                            ),
                        ),
                    ],
                },
                {
                    queuesOptions: {
                        [CrawlerFlowType.RequestRefreshPopulatedHtsTopView]: {
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

            throw error;
        }
    }

    @OnQueueProcessor(CrawlerFlowType.RequestDomesticVolumeRank)
    async processRequestDomesticVolumeRank(job: Job) {
        try {
            const childrenResponses =
                await this.koreaInvestmentRequestApiHelper.getChildResponses<
                    any,
                    DomesticStockQuotationVolumeRankOutput[]
                >(job);
            const childrenResults = childrenResponses.flatMap(
                ({ response }) => response.output,
            );

            await this.stockRepository.setVolumeRank(childrenResults);

            await this.requestRefreshPopulatedVolumeRankFlow.add(
                {
                    name: CrawlerFlowType.RequestRefreshPopulatedVolumeRank,
                    queueName:
                        CrawlerFlowType.RequestRefreshPopulatedVolumeRank,
                    children: [
                        this.koreaInvestmentRequestApiHelper.generateRequestApiForIntstockMultiPrice(
                            childrenResults.map(
                                (childrenResult) =>
                                    childrenResult.mksc_shrn_iscd,
                            ),
                        ),
                    ],
                },
                {
                    queuesOptions: {
                        [CrawlerFlowType.RequestRefreshPopulatedVolumeRank]: {
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

            throw error;
        }
    }

    @OnQueueProcessor(CrawlerFlowType.RequestRefreshPopulatedHtsTopView)
    async processRequestRefreshPopulatedHtsTopView(job: Job) {
        try {
            const childrenResponses =
                await this.koreaInvestmentRequestApiHelper.getChildResponses<
                    any,
                    DomesticStockQuotationsIntstockMultPriceOutput[]
                >(job);
            const childrenResults = childrenResponses.flatMap(
                ({ response }) => response.output,
            );

            const intStockMultiPriceMap = _.keyBy(
                childrenResults,
                'inter_shrn_iscd',
            );

            const htsTopViews = await this.stockRepository.getHtsTopView();
            const populatedHtsTopViews = htsTopViews.map((htsTopView) => {
                const stockPrice =
                    intStockMultiPriceMap[htsTopView.mksc_shrn_iscd];

                return {
                    htsTopView,
                    stockPrice,
                };
            });

            await this.stockRepository.setPopulatedHtsTopView(
                populatedHtsTopViews,
            );
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @OnQueueProcessor(CrawlerFlowType.RequestRefreshPopulatedVolumeRank)
    async processRequestRefreshPopulatedVolumeRank(job: Job) {
        try {
            const childrenResponses =
                await this.koreaInvestmentRequestApiHelper.getChildResponses<
                    any,
                    DomesticStockQuotationsIntstockMultPriceOutput[]
                >(job);
            const childrenResults = childrenResponses.flatMap(
                ({ response }) => response.output,
            );

            const intStockMultiPriceMap = _.keyBy(
                childrenResults,
                'inter_shrn_iscd',
            );

            const volumeRanks = await this.stockRepository.getVolumeRank();
            const populatedVolumeRanks = volumeRanks.map((rank) => {
                const stockPrice = intStockMultiPriceMap[rank.mksc_shrn_iscd];

                return {
                    volumeRank: rank,
                    stockPrice,
                };
            });

            await this.stockRepository.setPopulatedVolumeRank(
                populatedVolumeRanks,
            );
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }
}
