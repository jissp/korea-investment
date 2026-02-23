import { Injectable, Logger } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import {
    FavoriteStockService,
    FavoriteType,
} from '@app/modules/repositories/favorite-stock';

interface RemoveFavoriteStockArgs {
    stockCode: string;
}

@Injectable()
export class RemoveFavoriteStockUseCase implements BaseUseCase<
    RemoveFavoriteStockArgs,
    void
> {
    private logger = new Logger(RemoveFavoriteStockUseCase.name);

    constructor(private readonly favoriteStockService: FavoriteStockService) {}

    async execute(args: RemoveFavoriteStockArgs): Promise<void> {
        try {
            await this.favoriteStockService.deleteByStockCode({
                type: FavoriteType.Manual,
                stockCode: args.stockCode,
            });
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
