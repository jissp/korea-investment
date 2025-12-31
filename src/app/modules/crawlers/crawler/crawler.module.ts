import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { StockRepositoryModule } from '@app/modules/stock-repository';
import { KoreaInvestmentRequestApiModule } from '@app/modules/korea-investment-request-api';
import { KoreaInvestmentHelperModule } from '@modules/korea-investment/korea-investment-helper';
import { KoreaInvestmentQuotationClientModule } from '@modules/korea-investment/korea-investment-quotation-client';
import { CrawlerFlowType } from './crawler.types';
import { ChartSchedule, RankingSchedule } from './schedules';
import { KoreaInvestmentFlowProcessor } from './processors';

const flowTypes = [
    CrawlerFlowType.RequestDomesticVolumeRank,
    CrawlerFlowType.RequestRefreshPopulatedVolumeRank,
    CrawlerFlowType.RequestDomesticHtsTopView,
    CrawlerFlowType.RequestRefreshPopulatedHtsTopView,
    CrawlerFlowType.RequestDailyItemChartPrice,
];
const flowProviders = QueueModule.getFlowProviders(flowTypes);
const processors = [KoreaInvestmentFlowProcessor];
const schedules = [RankingSchedule, ChartSchedule];

@Module({
    imports: [
        QueueModule.forFeature({
            flowTypes,
            jobOptions: {
                removeOnFail: {
                    age: 86400,
                },
                removeOnComplete: {
                    age: 86400,
                    count: 3,
                },
            },
        }),
        KoreaInvestmentRequestApiModule,
        StockRepositoryModule,
        KoreaInvestmentQuotationClientModule,
        KoreaInvestmentHelperModule,
    ],
    providers: [...schedules, ...processors, ...flowProviders],
    exports: [...flowProviders],
})
export class CrawlerModule {}
