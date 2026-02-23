import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { MostViewedStockService } from '@app/modules/repositories/most-viewed-stock';
import { GetMostViewedStocksResponse } from '../dto';

export interface GetMostViewedStocksParams {
    limit: number;
}

@Injectable()
export class GetMostViewedStocksUseCase implements BaseUseCase<
    GetMostViewedStocksParams,
    GetMostViewedStocksResponse
> {
    constructor(
        private readonly mostViewedStockService: MostViewedStockService,
    ) {}

    async execute(
        params: GetMostViewedStocksParams,
    ): Promise<GetMostViewedStocksResponse> {
        const mostViewedStocks =
            await this.mostViewedStockService.getLatestMostViewedStocks(
                params.limit,
            );

        return {
            data: mostViewedStocks,
        };
    }
}
