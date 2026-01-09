import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { KoreaInvestmentHelperModule } from '@modules/korea-investment/korea-investment-helper';
import { KoreaInvestmentRequestApiModule } from '@app/modules/korea-investment-request-api';
import { FavoriteStockModule } from '@app/modules/repositories/favorite-stock';
import { StockDailyInvestorModule } from '@app/modules/repositories/stock-daily-investor';
import { StockCrawlerFlowType } from './stock-crawler.types';
import { StockCrawlerSchedule } from './stock-crawler.schedule';
import { StockCrawlerProcessor } from './stock-crawler.processor';

const flowTypes = [
    StockCrawlerFlowType.RequestStockInvestor,
    StockCrawlerFlowType.RequestDailyItemChartPrice,
];
const flowProviders = QueueModule.getFlowProviders(flowTypes);

@Module({
    imports: [
        QueueModule.forFeature({
            flowTypes,
        }),
        KoreaInvestmentRequestApiModule,
        KoreaInvestmentHelperModule,
        FavoriteStockModule,
        StockDailyInvestorModule,
    ],
    providers: [...flowProviders, StockCrawlerSchedule, StockCrawlerProcessor],
    exports: [StockCrawlerSchedule],
})
export class StockCrawlerModule {}
