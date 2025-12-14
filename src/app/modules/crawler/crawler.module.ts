import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { StockRepositoryModule } from '@app/modules/stock-repository';
import { StockPlusModule } from '@modules/stock-plus';
import { KoreaInvestmentQuotationClientModule } from '@modules/korea-investment/korea-investment-quotation-client';
import { KoreaInvestmentHelperModule } from '@modules/korea-investment/korea-investment-helper';
import { CrawlerFlowType, CrawlerQueueType } from './crawler.types';
import { NewsSchedule, RankingSchedule } from './schedules';
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
];
const flowProviders = QueueModule.getFlowProviders(flowTypes);
const processors = [KoreaInvestmentFlowProcessor, KoreaInvestmentProcessor];

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
        StockPlusModule,
    ],
    providers: [
        NewsSchedule,
        RankingSchedule,
        ...processors,
        ...queueProviders,
        ...flowProviders,
    ],
    exports: [...queueProviders, ...flowProviders],
})
export class CrawlerModule {}
