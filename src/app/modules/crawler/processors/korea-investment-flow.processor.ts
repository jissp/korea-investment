import * as _ from 'lodash';
import { FlowProducer, Job } from 'bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getDefaultJobOptions, OnQueueProcessor } from '@modules/queue';
import {
    KoreaIndexItem,
    OverseasGovernmentBondItem,
    OverseasIndexItem,
    StockRepository,
} from '@app/modules/stock-repository';
import {
    DomesticStockQuotationVolumeRankOutput,
    DomesticStockRankingHtsTopViewOutput,
} from '@modules/korea-investment/korea-investment-rank-client';
import {
    DomesticStockQuotationInquireIndexPriceOutput,
    DomesticStockQuotationInquireIndexPriceParam,
    DomesticStockQuotationsInquireDailyItemChartPriceOutput,
    DomesticStockQuotationsInquireDailyItemChartPriceOutput2,
    DomesticStockQuotationsIntstockMultPriceOutput,
    OverseasQuotationInquireDailyChartPriceOutput,
    OverseasQuotationInquireDailyChartPriceOutput2,
    OverseasQuotationInquireDailyChartPriceParam,
} from '@modules/korea-investment/korea-investment-quotation-client';
import {
    KoreaInvestmentCallApiMultiResult,
    KoreaInvestmentCallApiResult,
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
                (response) => response.output1,
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
                (response) => response.output,
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
                (response) => response.output,
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
                (response) => response.output,
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

    @OnQueueProcessor(CrawlerFlowType.RequestDailyItemChartPrice)
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

            await this.stockRepository.setDailyStockChart(stockCode, {
                output: childrenResults[0].output1,
                output2: childrenResults[0].output2,
            });
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @OnQueueProcessor(CrawlerFlowType.RequestKoreaIndex)
    async processRequestKoreaIndex(job: Job) {
        try {
            const childrenValues =
                await job.getChildrenValues<
                    KoreaInvestmentCallApiResult<
                        DomesticStockQuotationInquireIndexPriceParam,
                        DomesticStockQuotationInquireIndexPriceOutput
                    >
                >();

            const childrenResults = Object.values(childrenValues);
            const indexContents = Object.fromEntries(
                childrenResults.map(({ request, response }) => [
                    request.params.FID_INPUT_ISCD,
                    response.output,
                ]),
            ) as Record<string, KoreaIndexItem>;

            await this.stockRepository.setKoreaIndex(indexContents);
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @OnQueueProcessor(CrawlerFlowType.RequestOverseasIndex)
    async processRequestOverseasIndex(job: Job) {
        try {
            const childrenValues =
                await job.getChildrenValues<
                    KoreaInvestmentCallApiMultiResult<
                        DomesticStockQuotationInquireIndexPriceParam,
                        OverseasQuotationInquireDailyChartPriceOutput,
                        OverseasQuotationInquireDailyChartPriceOutput2
                    >
                >();

            const childrenResults = Object.values(childrenValues);
            const indexContents = Object.fromEntries(
                childrenResults.map(({ request, response }) => [
                    request.params.FID_INPUT_ISCD,
                    response.output1,
                ]),
            ) as Record<string, OverseasIndexItem>;

            await this.stockRepository.setOverseasIndex(indexContents);
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @OnQueueProcessor(CrawlerFlowType.RequestOverseasGovernmentBond)
    async processRequestOverseasGovernmentBond(job: Job) {
        try {
            const childrenValues =
                await job.getChildrenValues<
                    KoreaInvestmentCallApiMultiResult<
                        OverseasQuotationInquireDailyChartPriceParam,
                        OverseasQuotationInquireDailyChartPriceOutput,
                        OverseasQuotationInquireDailyChartPriceOutput2[]
                    >
                >();

            const childrenResults = Object.values(childrenValues);
            const indexContents = Object.fromEntries(
                childrenResults.map(({ request, response }) => [
                    request.params.FID_INPUT_ISCD,
                    {
                        output: response.output1,
                        output2: response.output2,
                    },
                ]),
            ) as Record<string, OverseasGovernmentBondItem>;

            await this.stockRepository.setOverseasGovernmentBonds(
                indexContents,
            );
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }
}
