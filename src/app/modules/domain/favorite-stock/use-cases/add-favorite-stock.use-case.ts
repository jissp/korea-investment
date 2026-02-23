import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { getStockName } from '@common/domains';
import {
    FavoriteStockService,
    FavoriteType,
} from '@app/modules/repositories/favorite-stock';

interface AddFavoriteStockArgs {
    stockCode: string;
}

@Injectable()
export class AddFavoriteStockUseCase implements BaseUseCase<
    AddFavoriteStockArgs,
    void
> {
    constructor(private readonly favoriteStockService: FavoriteStockService) {}

    async execute(args: AddFavoriteStockArgs): Promise<void> {
        await this.favoriteStockService.upsert({
            type: FavoriteType.Manual,
            stockCode: args.stockCode,
            stockName: getStockName(args.stockCode),
        });
    }
}
