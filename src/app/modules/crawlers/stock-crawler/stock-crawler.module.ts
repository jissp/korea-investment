import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { KoreaInvestmentAdditionalRequestApiModule } from '@app/modules/korea-investment-request-api/korea-investment-additional-request-api';
import { KoreaInvestmentCalendarModule } from '@app/modules/repositories/korea-investment-calendar';
import { StockModule } from '@app/modules/repositories/stock';
import { AccountStockGroupModule } from '@app/modules/repositories/account-stock-group';
import { FavoriteStockModule } from '@app/modules/repositories/favorite-stock';
import { StockInvestorModule } from '@app/modules/repositories/stock-investor';
import { StockCrawlerFlowType } from './stock-crawler.types';
import {
    AccountStockPriceProcessor,
    StockCrawlerProcessor,
} from './processors';
import { StockCrawlerSchedule } from './stock-crawler.schedule';
import { StockCrawlerService } from './stock-crawler.service';
import { StockCrawlerQueueService } from './stock-crawler-queue.service';

const RepositoryModules = [
    KoreaInvestmentCalendarModule,
    StockModule,
    AccountStockGroupModule,
    FavoriteStockModule,
    StockInvestorModule,
];

const flowTypes = [
    StockCrawlerFlowType.RequestStockInvestor,
    StockCrawlerFlowType.UpdateAccountStockGroupStockPrices,
];
const flowProviders = QueueModule.getFlowProviders(flowTypes);

@Module({
    imports: [
        QueueModule.forFeature({
            flowTypes,
            jobOptions: {
                removeOnComplete: true,
                removeOnFail: true,
            },
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
        StockCrawlerQueueService,
    ],
    exports: [StockCrawlerSchedule],
})
export class StockCrawlerModule {}
