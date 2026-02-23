import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import {
    FavoriteStock,
    FavoriteStockService,
    FavoriteType,
} from '@app/modules/repositories/favorite-stock';

@Injectable()
export class GetFavoriteStocksUseCase implements BaseUseCase<
    void,
    FavoriteStock[]
> {
    constructor(private readonly favoriteStockService: FavoriteStockService) {}

    async execute(): Promise<FavoriteStock[]> {
        return this.favoriteStockService.findByType(FavoriteType.Manual);
    }
}
