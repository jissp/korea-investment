import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { KoreaInvestmentConfigModule } from '@modules/korea-investment/korea-investment-config';
import {
    CredentialType,
    KoreaInvestmentHelperModule,
} from '@modules/korea-investment/korea-investment-helper';
import { KoreaInvestmentAdditionalRequestApiModule } from '@app/modules/korea-investment-request-api/korea-investment-additional-request-api';
import { MarketIndexModule } from '@app/modules/repositories/market-index';
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
        KoreaInvestmentHelperModule.forFeature(CredentialType.Additional),
        KoreaInvestmentAdditionalRequestApiModule,
        MarketIndexModule,
    ],
    providers: [
        ...flowProviders,
        KoreaInvestmentIndexCrawlerProcessor,
        KoreaInvestmentIndexCrawlerSchedule,
    ],
})
export class KoreaInvestmentIndexCrawlerModule {}
