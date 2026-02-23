import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { Nullable } from '@common/types';
import { Stock, StockService } from '@app/modules/repositories/stock';

@Injectable()
export class GetStockUseCase implements BaseUseCase<string, Nullable<Stock>> {
    constructor(private readonly stockService: StockService) {}

    async execute(stockCode: string): Promise<Nullable<Stock>> {
        return this.stockService.getStock(stockCode);
    }
}
