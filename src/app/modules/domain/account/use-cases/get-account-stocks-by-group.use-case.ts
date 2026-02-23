import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { AccountStockGroupStockService } from '@app/modules/repositories/account-stock-group';
import { GetAccountStocksResponse } from '../dto';

interface GetAccountStocksByGroupRequest {
    groupCode: string;
}

@Injectable()
export class GetAccountStocksByGroupUseCase implements BaseUseCase<
    GetAccountStocksByGroupRequest,
    GetAccountStocksResponse
> {
    constructor(
        private readonly accountStockGroupStockService: AccountStockGroupStockService,
    ) {}

    async execute(
        request: GetAccountStocksByGroupRequest,
    ): Promise<GetAccountStocksResponse> {
        const stocks =
            await this.accountStockGroupStockService.getAllByGroupCode(
                request.groupCode,
            );

        return {
            data: stocks,
        };
    }
}
