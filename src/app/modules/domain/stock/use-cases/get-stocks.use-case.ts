import { Injectable } from '@nestjs/common';
import { BaseUseCase, MarketType } from '@app/common/types';
import { Stock, StockService } from '@app/modules/repositories/stock';

@Injectable()
export class GetStocksUseCase implements BaseUseCase<void, Stock[]> {
    constructor(private readonly stockService: StockService) {}

    async execute(): Promise<Stock[]> {
        return this.stockService.getStocks({
            marketType: MarketType.Domestic,
        });
    }
}
