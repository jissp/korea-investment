import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { AccountStockGroupStockService } from '@app/modules/repositories/account-stock-group';
import { GetAccountStocksResponse } from '../dto';

@Injectable()
export class GetAccountStocksUseCase implements BaseUseCase<
    void,
    GetAccountStocksResponse
> {
    constructor(
        private readonly accountStockGroupStockService: AccountStockGroupStockService,
    ) {}

    async execute(): Promise<GetAccountStocksResponse> {
        const stocks = await this.accountStockGroupStockService.getAll();

        return {
            data: stocks,
        };
    }
}
