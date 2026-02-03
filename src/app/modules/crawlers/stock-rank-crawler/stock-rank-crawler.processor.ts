import { keyBy } from 'lodash';
import { FlowProducer, Job } from 'bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getDefaultJobOptions, OnQueueProcessor } from '@modules/queue';
import {
    DomesticStockQuotationsIntstockMultPriceOutput,
    DomesticStockQuotationVolumeRankOutput,
    DomesticStockRankingHtsTopViewOutput,
    MarketDivCode,
} from '@modules/korea-investment/common';
import { ExchangeType } from '@app/common/types';
import {
    MostViewedStockTransformer,
    TradingVolumeRankTransformer,
} from '@app/common/korea-investment';
import {
    KoreaInvestmentRequestApiHelper,
    KoreaInvestmentRequestApiType,
} from '@app/modules/korea-investment-request-api/common';
import { MostViewedStockService } from '@app/modules/repositories/most-viewed-stock';
import { TradingVolumeRankService } from '@app/modules/repositories/trading-volume-rank';
import {
    HtsTopView,
    StockRankCrawlerFlowType,
} from './stock-rank-crawler.types';

interface RequestPopulatedHtsTopViewJobData {
    htsTopViews: HtsTopView[];
}

@Injectable()
export class StockRankCrawlerProcessor {
    private readonly logger: Logger = new Logger(
        StockRankCrawlerProcessor.name,
    );

    constructor(
        private readonly koreaInvestmentRequestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly mostViewedStockService: MostViewedStockService,
        private readonly tradingVolumeRankService: TradingVolumeRankService,
        @Inject(StockRankCrawlerFlowType.RequestPopulatedHtsTopView)
        private readonly requestHtsTopViewStockPricesFlow: FlowProducer,
    ) {}

    @OnQueueProcessor(StockRankCrawlerFlowType.RequestHtsTopViews)
    async processRequestHtsTopViewList(job: Job) {
        try {
            const childrenResponses =
                await this.koreaInvestmentRequestApiHelper.getChildMultiResponses<
                    any,
                    DomesticStockRankingHtsTopViewOutput[],
                    unknown
                >(job);

            const htsTopViews = childrenResponses.flatMap(({ response }) =>
                response.output1.map(
                    (output): HtsTopView => ({
                        stockCode: output.mksc_shrn_iscd,
                        exchangeType:
                            output.mrkt_div_cls_code === 'J'
                                ? ExchangeType.KOSPI
                                : ExchangeType.KOSDAQ,
                    }),
                ),
            );

            const queueName =
                StockRankCrawlerFlowType.RequestPopulatedHtsTopView;
            await this.requestHtsTopViewStockPricesFlow.add(
                {
                    name: queueName,
                    queueName,
                    data: {
                        htsTopViews,
                    } as RequestPopulatedHtsTopViewJobData,
                    children: [
                        this.koreaInvestmentRequestApiHelper.generateRequestApiForIntstockMultiPrice(
                            MarketDivCode.KRX,
                            htsTopViews.map(({ stockCode }) => stockCode),
                        ),
                    ],
                },
                {
                    queuesOptions: {
                        [queueName]: {
                            defaultJobOptions: getDefaultJobOptions(),
                        },
                        [KoreaInvestmentRequestApiType.Additional]: {
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

    @OnQueueProcessor(StockRankCrawlerFlowType.RequestPopulatedHtsTopView)
    async process(job: Job<RequestPopulatedHtsTopViewJobData>) {
        const { htsTopViews } = job.data;

        const childrenResponses =
            await this.koreaInvestmentRequestApiHelper.getChildResponses<
                any,
                DomesticStockQuotationsIntstockMultPriceOutput[]
            >(job);

        const multiPriceOutputs = childrenResponses.flatMap(
            ({ response }) => response.output,
        );

        const multiPriceOutputMap = keyBy(
            multiPriceOutputs,
            (output) => output.inter_shrn_iscd,
        );

        const transformer = new MostViewedStockTransformer();

        const mostViewedStockDtoList = htsTopViews.map((htsTopView) => {
            return transformer.transform({
                stock: htsTopView,
                output: multiPriceOutputMap[htsTopView.stockCode],
            });
        });

        await this.mostViewedStockService.upsert(mostViewedStockDtoList);
    }

    @OnQueueProcessor(StockRankCrawlerFlowType.RequestVolumeRanks)
    async processRequestVolumeRanks(job: Job) {
        try {
            const childrenResponses =
                await this.koreaInvestmentRequestApiHelper.getChildResponses<
                    any,
                    DomesticStockQuotationVolumeRankOutput[]
                >(job);
            const childrenResults = childrenResponses.flatMap(
                ({ response }) => response.output,
            );

            const transformer = new TradingVolumeRankTransformer();
            const tradingVolumeRankDtoList = childrenResults.map((output) =>
                transformer.transform(output),
            );

            await this.tradingVolumeRankService.upsert(
                tradingVolumeRankDtoList,
            );
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }
}
