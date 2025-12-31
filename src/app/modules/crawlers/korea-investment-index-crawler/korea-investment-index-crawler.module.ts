import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { KoreaInvestmentConfigModule } from '@modules/korea-investment/korea-investment-config';
import { KoreaInvestmentHelperModule } from '@modules/korea-investment/korea-investment-helper';
import { KoreaInvestmentRequestApiModule } from '@app/modules/korea-investment-request-api';
import { IndexRepositoryModule } from '@app/modules/repositories';
import { KoreaInvestmentIndexCrawlerFlowType } from './korea-investment-index-crawler.types';
import { KoreaInvestmentIndexCrawlerProcessor } from './korea-investment-index-crawler.processor';
import { KoreaInvestmentIndexCrawlerSchedule } from './korea-investment-index-crawler.schedule';

const flowTypes = [
    KoreaInvestmentIndexCrawlerFlowType.RequestKoreaDailyIndex,
    KoreaInvestmentIndexCrawlerFlowType.RequestOverseasIndex,
    KoreaInvestmentIndexCrawlerFlowType.RequestOverseasGovernmentBond,
];
const flowProviders = QueueModule.getFlowProviders(flowTypes);

@Module({
    imports: [
        QueueModule.forFeature({
            flowTypes,
        }),
        KoreaInvestmentConfigModule,
        KoreaInvestmentHelperModule,
        KoreaInvestmentRequestApiModule,
        IndexRepositoryModule,
    ],
    providers: [
        ...flowProviders,
        KoreaInvestmentIndexCrawlerProcessor,
        KoreaInvestmentIndexCrawlerSchedule,
    ],
})
export class KoreaInvestmentIndexCrawlerModule {}
