import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { KoreaInvestmentQuotationClientModule } from '@modules/korea-investment/korea-investment-quotation-client';
import { KoreaInvestmentAdditionalRequestApiModule } from '@app/modules/korea-investment-request-api/korea-investment-additional-request-api';
import { StockModule } from '@app/modules/repositories/stock';
import { MostViewedStockModule } from '@app/modules/repositories/most-viewed-stock';
import { TradingVolumeRankModule } from '@app/modules/repositories/trading-volume-rank';
import { StockRankCrawlerFlowType } from './stock-rank-crawler.types';
import { StockRankCrawlerProcessor } from './stock-rank-crawler.processor';
import { StockRankCrawlerSchedule } from './stock-rank-crawler.schedule';

const flowTypes = [
    StockRankCrawlerFlowType.RequestHtsTopViews,
    StockRankCrawlerFlowType.RequestPopulatedHtsTopView,
    StockRankCrawlerFlowType.RequestVolumeRanks,
];

const flowProviders = QueueModule.getFlowProviders(flowTypes);

@Module({
    imports: [
        QueueModule.forFeature({
            flowTypes,
            jobOptions: {
                removeOnFail: {
                    count: 10,
                },
                removeOnComplete: {
                    count: 3,
                },
            },
        }),
        KoreaInvestmentAdditionalRequestApiModule,
        KoreaInvestmentQuotationClientModule,
        StockModule,
        MostViewedStockModule,
        TradingVolumeRankModule,
    ],
    providers: [
        ...flowProviders,
        StockRankCrawlerSchedule,
        StockRankCrawlerProcessor,
    ],
    exports: [...flowProviders],
})
export class StockRankCrawlerModule {}
