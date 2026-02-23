import { Injectable } from '@nestjs/common';
import { BaseUseCase, MarketType } from '@app/common/types';
import { Stock, StockService } from '@app/modules/repositories/stock';

interface SearchStocksArgs {
    stockName: string;
}

@Injectable()
export class SearchStocksUseCase implements BaseUseCase<
    SearchStocksArgs,
    Stock[]
> {
    constructor(private readonly stockService: StockService) {}

    async execute(args: SearchStocksArgs): Promise<Stock[]> {
        return this.stockService.getStocks({
            marketType: MarketType.Domestic,
            name: args.stockName,
        });
    }
}
