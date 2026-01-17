import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { KoreaInvestmentAdditionalRequestApiModule } from '@app/modules/korea-investment-request-api/korea-investment-additional-request-api';
import { KoreaInvestmentHolidayModule } from '@app/modules/repositories/korea-investment-holiday';
import { StockModule } from '@app/modules/repositories/stock';
import { AccountStockGroupModule } from '@app/modules/repositories/account-stock-group';
import { FavoriteStockModule } from '@app/modules/repositories/favorite-stock';
import { StockInvestorModule } from '@app/modules/repositories/stock-investor';
import {
    AccountStockPriceProcessor,
    StockCrawlerProcessor,
} from './processors';
import { StockCrawlerFlowType } from './stock-crawler.types';
import { StockCrawlerSchedule } from './stock-crawler.schedule';
import { StockCrawlerService } from './stock-crawler.service';

const RepositoryModules = [
    KoreaInvestmentHolidayModule,
    StockModule,
    AccountStockGroupModule,
    FavoriteStockModule,
    StockInvestorModule,
];

const flowTypes = [
    StockCrawlerFlowType.RequestStockInvestor,
    StockCrawlerFlowType.RequestStockHourInvestorByForeigner,
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
        ...RepositoryModules,
    ],
    providers: [
        ...flowProviders,
        StockCrawlerSchedule,
        StockCrawlerProcessor,
        AccountStockPriceProcessor,
        StockCrawlerService,
    ],
    exports: [StockCrawlerSchedule],
})
export class StockCrawlerModule {}
