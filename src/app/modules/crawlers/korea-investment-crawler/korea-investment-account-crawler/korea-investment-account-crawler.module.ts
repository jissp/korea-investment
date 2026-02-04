import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { KoreaInvestmentConfigModule } from '@modules/korea-investment/korea-investment-config';
import { KoreaInvestmentMainRequestApiModule } from '@app/modules/korea-investment-request-api/korea-investment-main-request-api';
import { AccountModule } from '@app/modules/repositories/account';
import { AccountStockGroupModule } from '@app/modules/repositories/account-stock-group';
import { StockModule } from '@app/modules/repositories/stock';
import { FavoriteStockModule } from '@app/modules/repositories/favorite-stock';
import { KeywordModule } from '@app/modules/repositories/keyword';
import { KoreaInvestmentAccountCrawlerType } from './korea-investment-account-crawler.types';
import { KoreaInvestmentAccountProcessor } from './korea-investment-account.processor';
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
        KoreaInvestmentMainRequestApiModule,
        AccountModule,
        AccountStockGroupModule,
        KeywordModule,
        FavoriteStockModule,
        StockModule,
    ],
    providers: [
        ...flowProviders,
        KoreaInvestmentAccountProcessor,
        KoreaInvestmentAccountCrawlerSchedule,
    ],
    exports: [],
})
export class KoreaInvestmentAccountCrawlerModule {}
