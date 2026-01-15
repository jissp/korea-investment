import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import {
    CredentialType,
    KoreaInvestmentHelperModule,
} from '@modules/korea-investment/korea-investment-helper';
import { KoreaInvestmentAdditionalRequestApiModule } from '@app/modules/korea-investment-request-api/korea-investment-additional-request-api';
import { StockModule } from '@app/modules/repositories/stock';
import { AccountStockGroupModule } from '@app/modules/repositories/account-stock-group';
import { FavoriteStockModule } from '@app/modules/repositories/favorite-stock';
import { StockDailyInvestorModule } from '@app/modules/repositories/stock-daily-investor';
import {
    AccountStockPriceProcessor,
    StockCrawlerProcessor,
} from './processors';
import { StockCrawlerFlowType } from './stock-crawler.types';
import { StockCrawlerSchedule } from './stock-crawler.schedule';

const RepositoryModules = [
    StockModule,
    AccountStockGroupModule,
    FavoriteStockModule,
    StockDailyInvestorModule,
];

const flowTypes = [
    StockCrawlerFlowType.RequestStockInvestor,
    StockCrawlerFlowType.RequestDailyItemChartPrice,
    StockCrawlerFlowType.UpdateAccountStockGroupStockPrices,
];
const flowProviders = QueueModule.getFlowProviders(flowTypes);

@Module({
    imports: [
        QueueModule.forFeature({
            flowTypes,
        }),
        KoreaInvestmentAdditionalRequestApiModule,
        KoreaInvestmentHelperModule.forFeature(CredentialType.Additional),
        ...RepositoryModules,
    ],
    providers: [
        ...flowProviders,
        StockCrawlerSchedule,
        StockCrawlerProcessor,
        AccountStockPriceProcessor,
    ],
    exports: [StockCrawlerSchedule],
})
export class StockCrawlerModule {}
