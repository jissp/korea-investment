import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { KoreaInvestmentHelperModule } from '@modules/korea-investment/korea-investment-helper';
import { KoreaInvestmentRequestApiModule } from '@app/modules/korea-investment-request-api';
import { StockRepositoryModule } from '@app/modules/repositories/stock-repository';
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
        StockRepositoryModule,
    ],
    providers: [...flowProviders, StockCrawlerSchedule, StockCrawlerProcessor],
    exports: [StockCrawlerSchedule],
})
export class StockCrawlerModule {}
