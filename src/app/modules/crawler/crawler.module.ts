import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { StockRepositoryModule } from '@app/modules/stock-repository';
import { KoreaInvestmentSettingModule } from '@app/modules/korea-investment-setting';
import { KoreaInvestmentHelperModule } from '@modules/korea-investment/korea-investment-helper';
import { KoreaInvestmentQuotationClientModule } from '@modules/korea-investment/korea-investment-quotation-client';
import { StockPlusModule } from '@modules/stock-plus';
import { CrawlerFlowType, CrawlerQueueType } from './crawler.types';
import {
    ChartSchedule,
    NewsSchedule,
    RankingSchedule,
    StockIndexSchedule,
} from './schedules';
import {
    KoreaInvestmentFlowProcessor,
    KoreaInvestmentProcessor,
} from './processors';

const queueTypes = [CrawlerQueueType.RequestKoreaInvestmentApi];
const queueProviders = QueueModule.getQueueProviders(queueTypes);
const flowTypes = [
    CrawlerFlowType.RequestDomesticNewsTitle,
    CrawlerFlowType.RequestDomesticVolumeRank,
    CrawlerFlowType.RequestRefreshPopulatedVolumeRank,
    CrawlerFlowType.RequestDomesticHtsTopView,
    CrawlerFlowType.RequestRefreshPopulatedHtsTopView,
    CrawlerFlowType.RequestDailyItemChartPrice,
    CrawlerFlowType.RequestKoreaIndex,
    CrawlerFlowType.RequestOverseasIndex,
    CrawlerFlowType.RequestOverseasGovernmentBond,
];
const flowProviders = QueueModule.getFlowProviders(flowTypes);
const processors = [KoreaInvestmentFlowProcessor, KoreaInvestmentProcessor];
const schedules = [
    NewsSchedule,
    RankingSchedule,
    ChartSchedule,
    StockIndexSchedule,
];

@Module({
    imports: [
        QueueModule.forFeature({
            queueTypes,
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
        StockRepositoryModule,
        KoreaInvestmentQuotationClientModule,
        KoreaInvestmentHelperModule,
        KoreaInvestmentSettingModule,
        StockPlusModule,
    ],
    providers: [
        ...schedules,
        ...processors,
        ...queueProviders,
        ...flowProviders,
    ],
    exports: [...queueProviders, ...flowProviders],
})
export class CrawlerModule {}
