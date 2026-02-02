import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { toDateByKoreaInvestmentYmd } from '@common/utils';
import { OnQueueProcessor } from '@modules/queue';
import {
    DomesticDailyIndexTransformer,
    DomesticIndexTransformer,
    OverseasDailyGovernmentBondTransformer,
    OverseasDailyIndexTransformer,
    OverseasGovernmentBondTransformer,
    OverseasIndexTransformer,
} from '@app/common/korea-investment';
import { MarketIndexService } from '@app/modules/repositories/market-index';
import {
    KoreaInvestmentCallApiMultiResult,
    KoreaInvestmentRequestApiHelper,
} from '@app/modules/korea-investment-request-api/common';
import { KoreaInvestmentIndexCrawlerFlowType } from './korea-investment-index-crawler.types';
import {
    KoreaInvestmentDomesticInquireIndexDailyPriceOutput,
    KoreaInvestmentDomesticInquireIndexDailyPriceOutput2,
    KoreaInvestmentDomesticInquireIndexDailyPriceParam,
    OverseasQuotationInquireDailyChartPriceOutput,
    OverseasQuotationInquireDailyChartPriceOutput2,
    OverseasQuotationInquireDailyChartPriceParam,
} from './korea-investment-index-crawler.interface';

@Injectable()
export class KoreaInvestmentIndexCrawlerProcessor {
    private readonly logger = new Logger(
        KoreaInvestmentIndexCrawlerProcessor.name,
    );

    constructor(
        private readonly marketIndexService: MarketIndexService,
        private readonly koreaInvestmentRequestApiHelper: KoreaInvestmentRequestApiHelper,
    ) {}

    @OnQueueProcessor(
        KoreaInvestmentIndexCrawlerFlowType.RequestKoreaDailyIndex,
    )
    async processRequestDomesticDailyIndex(job: Job) {
        try {
            const childrenResponses =
                await this.koreaInvestmentRequestApiHelper.getChildMultiResponses<
                    KoreaInvestmentDomesticInquireIndexDailyPriceParam,
                    KoreaInvestmentDomesticInquireIndexDailyPriceOutput,
                    KoreaInvestmentDomesticInquireIndexDailyPriceOutput2[]
                >(job);

            const indexContents = childrenResponses.map(
                ({ request, response }) => ({
                    code: request.params.FID_INPUT_ISCD,
                    output: response.output1,
                    output2: response.output2,
                }),
            );

            const transformer = new DomesticIndexTransformer();
            const dailyTransformer = new DomesticDailyIndexTransformer();

            for (const { code, output, output2 } of indexContents) {
                // 국내 지수 - 오늘 데이터
                const todayMarketIndex = transformer.transform({
                    code,
                    output,
                });

                // 국내 지수 - 일자별 데이터
                const dailyMarketIndices = output2.map((output2Item) => {
                    const date = toDateByKoreaInvestmentYmd(
                        output2Item.stck_bsop_date,
                    );

                    return dailyTransformer.transform({
                        code,
                        date,
                        output2: output2Item,
                    });
                });

                await this.marketIndexService.upsert(
                    [todayMarketIndex, ...dailyMarketIndices].flatMap(
                        (marketIndex) => marketIndex,
                    ),
                );
            }
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @OnQueueProcessor(KoreaInvestmentIndexCrawlerFlowType.RequestOverseasIndex)
    async processRequestOverseasIndex(job: Job) {
        try {
            const childrenResponses =
                await this.koreaInvestmentRequestApiHelper.getChildMultiResponses<
                    OverseasQuotationInquireDailyChartPriceParam,
                    OverseasQuotationInquireDailyChartPriceOutput,
                    OverseasQuotationInquireDailyChartPriceOutput2[]
                >(job);

            const indexContents = childrenResponses.map(
                ({ request, response }) => ({
                    code: request.params.FID_INPUT_ISCD,
                    output: response.output1,
                    output2: response.output2,
                }),
            );

            const transformer = new OverseasIndexTransformer();
            const dailyTransformer = new OverseasDailyIndexTransformer();

            for (const { code, output, output2 } of indexContents) {
                // 해외 지수 - 오늘 데이터
                const todayMarketIndex = transformer.transform({
                    code,
                    output,
                });

                // 해외 지수 - 일자별 데이터
                const dailyMarketIndices = output2.map((output2Item) => {
                    const date = toDateByKoreaInvestmentYmd(
                        output2Item.stck_bsop_date,
                    );

                    return dailyTransformer.transform({
                        code,
                        date,
                        output2: output2Item,
                    });
                });

                await Promise.all(
                    [todayMarketIndex, ...dailyMarketIndices].map(
                        (marketIndex) =>
                            this.marketIndexService.upsert(marketIndex),
                    ),
                );
            }
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @OnQueueProcessor(
        KoreaInvestmentIndexCrawlerFlowType.RequestOverseasGovernmentBond,
    )
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
            const indexContents = childrenResults.map(
                ({ request, response }) => ({
                    code: request.params.FID_INPUT_ISCD,
                    output: response.output1,
                    output2: response.output2,
                }),
            );

            const transformer = new OverseasGovernmentBondTransformer();
            const dailyTransformer =
                new OverseasDailyGovernmentBondTransformer();

            for (const { code, output, output2 } of indexContents) {
                // 미국 국채 - 오늘 데이터
                const todayMarketIndex = transformer.transform({
                    code,
                    output,
                });

                // 미국 국채 - 일자별 데이터
                const dailyMarketIndices = output2.map((output2Item) => {
                    const date = toDateByKoreaInvestmentYmd(
                        output2Item.stck_bsop_date,
                    );

                    return dailyTransformer.transform({
                        code,
                        date,
                        output2: output2Item,
                    });
                });

                await Promise.all(
                    [todayMarketIndex, ...dailyMarketIndices].map(
                        (marketIndex) =>
                            this.marketIndexService.upsert(marketIndex),
                    ),
                );
            }
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }
}
