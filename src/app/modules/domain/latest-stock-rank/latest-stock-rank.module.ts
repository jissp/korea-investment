import { Module } from '@nestjs/common';
import { RepositoryModule } from '@app/modules/repositories/repository.module';
import {
    GetMostViewedStocksUseCase,
    GetTradingVolumeRanksUseCase,
} from './use-cases';
import { LatestStockRankController } from './latest-stock-rank.controller';

@Module({
    imports: [RepositoryModule],
    controllers: [LatestStockRankController],
    providers: [GetMostViewedStocksUseCase, GetTradingVolumeRanksUseCase],
    exports: [],
})
export class LatestStockRankModule {}
