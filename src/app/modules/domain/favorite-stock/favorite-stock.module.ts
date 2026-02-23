import { Module } from '@nestjs/common';
import { RepositoryModule } from '@app/modules/repositories/repository.module';
import {
    AddFavoriteStockUseCase,
    GetFavoriteStocksUseCase,
    RemoveFavoriteStockUseCase,
} from './use-cases';
import { FavoriteStockController } from './favorite-stock.controller';

const UseCases = [
    AddFavoriteStockUseCase,
    RemoveFavoriteStockUseCase,
    GetFavoriteStocksUseCase,
];

@Module({
    imports: [RepositoryModule],
    controllers: [FavoriteStockController],
    providers: UseCases,
    exports: [],
})
export class FavoriteStockModule {}
