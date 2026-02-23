import { Module } from '@nestjs/common';
import { RepositoryModule } from '@app/modules/repositories/repository.module';
import { AnalyzerModule } from '@app/modules/analysis/analyzer';
import { KoreaInvestmentCollectorModule } from '@app/modules/korea-investment-collector/korea-investment-collector.module';
import { KoreaInvestmentRequestApiModule } from '@app/modules/korea-investment-request-api/korea-investment-request-api.module';
import { KoreaInvestmentQuotationClientModule } from '@modules/korea-investment/korea-investment-quotation-client';
import {
    GetDailyPricesUseCase,
    GetStockPricesUseCase,
    GetStockScoresUseCase,
    GetStocksUseCase,
    GetStockUseCase,
    SearchStocksUseCase,
    SubscribeStockUseCase,
    UnsubscribeStockUseCase,
} from './use-cases';
import { StockController } from './stock.controller';
import { StockSubscribeController } from './stock-subscribe.controller';

@Module({
    imports: [
        RepositoryModule,
        AnalyzerModule,
        KoreaInvestmentCollectorModule,
        KoreaInvestmentRequestApiModule,
        KoreaInvestmentQuotationClientModule,
    ],
    controllers: [StockController, StockSubscribeController],
    providers: [
        GetStocksUseCase,
        SearchStocksUseCase,
        GetDailyPricesUseCase,
        GetStockPricesUseCase,
        GetStockScoresUseCase,
        GetStockUseCase,
        SubscribeStockUseCase,
        UnsubscribeStockUseCase,
    ],
    exports: [],
})
export class StockModule {}
