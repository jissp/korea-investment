import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { KoreaInvestmentConfigModule } from '@modules/korea-investment/korea-investment-config';
import { KoreaInvestmentHelperModule } from '@modules/korea-investment/korea-investment-helper';
import { KoreaInvestmentRequestApiModule } from '@app/modules/korea-investment-request-api';
import { AccountModule } from '@app/modules/repositories/account';
import { FavoriteStockModule } from '@app/modules/repositories/favorite-stock';
import { KeywordModule } from '@app/modules/repositories/keyword';
import { KoreaInvestmentAccountCrawlerType } from './korea-investment-account-crawler.types';
import { KoreaInvestmentAccountCrawlerListener } from './korea-investment-account-crawler.listener';
import { KoreaInvestmentAccountCrawlerProcessor } from './korea-investment-account-crawler.processor';
import { KoreaInvestmentAccountCrawlerSchedule } from './korea-investment-account-crawler.schedule';

const flowTypes = [
    KoreaInvestmentAccountCrawlerType.RequestAccount,
    KoreaInvestmentAccountCrawlerType.RequestAccountStocks,
    KoreaInvestmentAccountCrawlerType.RequestAccountStockGroups,
    KoreaInvestmentAccountCrawlerType.RequestAccountStocksByGroup,
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
        AccountModule,
        KeywordModule,
        FavoriteStockModule,
    ],
    providers: [
        ...flowProviders,
        KoreaInvestmentAccountCrawlerListener,
        KoreaInvestmentAccountCrawlerProcessor,
        KoreaInvestmentAccountCrawlerSchedule,
    ],
    exports: [],
})
export class KoreaInvestmentAccountCrawlerModule {}
