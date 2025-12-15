import * as _ from 'lodash';
import { FlowProducer, Job } from 'bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getDefaultJobOptions, OnQueueProcessor } from '@modules/queue';
import { StockRepository } from '@app/modules/stock-repository';
import {
    BaseMultiResponse,
    BaseResponse,
} from '@modules/korea-investment/common';
import {
    DomesticStockQuotationVolumeRankOutput,
    DomesticStockRankingHtsTopViewOutput,
} from '@modules/korea-investment/korea-investment-rank-client';
import {
    DomesticStockQuotationInquireIndexPriceOutput,
    DomesticStockQuotationsInquireDailyItemChartPriceOutput,
    DomesticStockQuotationsInquireDailyItemChartPriceOutput2,
    DomesticStockQuotationsIntstockMultPriceOutput,
    DomesticStockQuotationsIntstockMultPriceParam,
    DomesticStockQuotationsNewsTitleOutput,
    OverseasQuotationInquireDailyChartPriceOutput,
    OverseasQuotationInquireDailyChartPriceOutput2,
} from '@modules/korea-investment/korea-investment-quotation-client';
import {
    CrawlerFlowType,
    CrawlerQueueType,
    KoreaInvestmentCallApiParam,
} from '../crawler.types';

@Injectable()
export class KoreaInvestmentFlowProcessor {
    private readonly logger: Logger = new Logger(
        KoreaInvestmentFlowProcessor.name,
    );

    constructor(
        private readonly stockRepository: StockRepository,
        @Inject(CrawlerFlowType.RequestRefreshPopulatedVolumeRank)
        private readonly requestRefreshPopulatedVolumeRankFlow: FlowProducer,
        @Inject(CrawlerFlowType.RequestRefreshPopulatedHtsTopView)
        private readonly requestRefreshPopulatedHtsTopViewFlow: FlowProducer,
    ) {}

    @OnQueueProcessor(CrawlerFlowType.RequestDomesticNewsTitle)
    async processRequestDomesticNewsTitle(job: Job) {
        try {
            const childrenValues = await job.getChildrenValues();

            const childrenResults: DomesticStockQuotationsNewsTitleOutput[] =
                Object.values(childrenValues).flatMap((v) => v.output);

            await this.stockRepository.setKoreaInvestmentNews(childrenResults);
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @OnQueueProcessor(CrawlerFlowType.RequestDomesticHtsTopView)
    async processRequestDomesticHtsTopView(job: Job) {
        try {
            const childrenValues = await job.getChildrenValues();

            const childrenResults: DomesticStockRankingHtsTopViewOutput[] =
                Object.values(childrenValues).flatMap((v) => v.output1);

            await this.stockRepository.setHtsTopView(childrenResults);

            await this.requestRefreshPopulatedHtsTopViewFlow.add(
                {
                    name: CrawlerFlowType.RequestRefreshPopulatedHtsTopView,
                    queueName:
                        CrawlerFlowType.RequestRefreshPopulatedHtsTopView,
                    children: [
                        this.generateRequestApiForIntstockMultiPrice(
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
                        [CrawlerQueueType.RequestKoreaInvestmentApi]: {
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
            const childrenValues = await job.getChildrenValues();

            const childrenResults: DomesticStockQuotationVolumeRankOutput[] =
                Object.values(childrenValues).flatMap((v) => v.output);

            await this.stockRepository.setVolumeRank(childrenResults);

            await this.requestRefreshPopulatedVolumeRankFlow.add(
                {
                    name: CrawlerFlowType.RequestRefreshPopulatedVolumeRank,
                    queueName:
                        CrawlerFlowType.RequestRefreshPopulatedVolumeRank,
                    children: [
                        this.generateRequestApiForIntstockMultiPrice(
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
                        [CrawlerQueueType.RequestKoreaInvestmentApi]: {
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
            const childrenValues = await job.getChildrenValues();

            const childrenResults: DomesticStockQuotationsIntstockMultPriceOutput[] =
                Object.values(childrenValues).flatMap((v) => v.output);

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
            const childrenValues = await job.getChildrenValues();

            const childrenResults: DomesticStockQuotationsIntstockMultPriceOutput[] =
                Object.values(childrenValues).flatMap((v) => v.output);

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
            const childrenValues = await job.getChildrenValues();

            const values: BaseMultiResponse<
                DomesticStockQuotationsInquireDailyItemChartPriceOutput,
                DomesticStockQuotationsInquireDailyItemChartPriceOutput2[]
            >[] = Object.values(childrenValues);
            if (!values.length) {
                return;
            }

            await this.stockRepository.setDailyStockChart(stockCode, {
                output: values[0].output1,
                output2: values[0].output2,
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
                    BaseResponse<DomesticStockQuotationInquireIndexPriceOutput>
                >();

            const [kospi, kosdaq] = Object.values(childrenValues);

            await this.stockRepository.setKoreaIndex({
                kospi: kospi.output,
                kosdaq: kosdaq.output,
            });
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
                    BaseMultiResponse<
                        OverseasQuotationInquireDailyChartPriceOutput,
                        OverseasQuotationInquireDailyChartPriceOutput2[]
                    >
                >();

            /**
             * .DJI: 다우존스
             * COMP: 나스닥
             * SPX: S&P500
             * SOX: 필라델피아 반도체 지수
             */
            const [dji, comp, spx, sox] = Object.values(childrenValues).map(
                (value) => value.output1,
            );

            await this.stockRepository.setOverseasIndex({
                dji,
                comp,
                spx,
                sox,
            });
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    /**
     * @param iscdList
     * @private
     */
    private generateRequestApiForIntstockMultiPrice(iscdList: string[]) {
        return {
            name: CrawlerQueueType.RequestKoreaInvestmentApi,
            queueName: CrawlerQueueType.RequestKoreaInvestmentApi,
            data: {
                url: '/uapi/domestic-stock/v1/quotations/intstock-multprice',
                tradeId: 'FHKST11300006',
                params: this.buildIntstockMultiPriceParam(iscdList),
            } as KoreaInvestmentCallApiParam<DomesticStockQuotationsIntstockMultPriceParam>,
        };
    }

    /**
     * @param iscdList
     * @private
     */
    private buildIntstockMultiPriceParam(
        iscdList: string[],
    ): DomesticStockQuotationsIntstockMultPriceParam {
        const params: DomesticStockQuotationsIntstockMultPriceParam = {
            FID_COND_MRKT_DIV_CODE_1: 'UN',
            FID_INPUT_ISCD_1: '',
        };

        iscdList.forEach((iscd, index) => {
            const indexKey = index + 1;
            const marketDivCodeKey =
                `FID_COND_MRKT_DIV_CODE_${indexKey}` as keyof DomesticStockQuotationsIntstockMultPriceParam;
            const inputIscdKey =
                `FID_INPUT_ISCD_${indexKey}` as keyof DomesticStockQuotationsIntstockMultPriceParam;

            params[marketDivCodeKey] = 'UN';
            params[inputIscdKey] = iscd;
        });

        return params;
    }
}
