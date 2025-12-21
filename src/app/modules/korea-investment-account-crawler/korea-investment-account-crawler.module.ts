import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { KoreaInvestmentHelperModule } from '@modules/korea-investment/korea-investment-helper';
import { KoreaInvestmentRequestApiModule } from '@app/modules/korea-investment-request-api';
import { KoreaInvestmentAccountCrawlerType } from './korea-investment-account-crawler.types';
import { KoreaInvestmentAccountCrawlerProcessor } from './korea-investment-account-crawler.processor';
import { KoreaInvestmentAccountCrawlerSchedule } from './korea-investment-account-crawler.schedule';
import { KoreaInvestmentAccountModule } from '@app/modules/korea-investment-account';

const flowTypes = [
    KoreaInvestmentAccountCrawlerType.RequestAccount,
    KoreaInvestmentAccountCrawlerType.RequestAccountStocks,
];
const flowProviders = QueueModule.getFlowProviders(flowTypes);

@Module({
    imports: [
        QueueModule.forFeature({
            flowTypes,
        }),
        KoreaInvestmentHelperModule,
        KoreaInvestmentRequestApiModule,
        KoreaInvestmentAccountModule,
    ],
    providers: [
        ...flowProviders,
        KoreaInvestmentAccountCrawlerProcessor,
        KoreaInvestmentAccountCrawlerSchedule,
    ],
    exports: [],
})
export class KoreaInvestmentAccountCrawlerModule {}
