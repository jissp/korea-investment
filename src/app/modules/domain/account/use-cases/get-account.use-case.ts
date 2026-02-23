import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import {
    Account,
    AccountStockService,
} from '@app/modules/repositories/account';
import { GetAccountResponse } from '@app/modules/domain/account';

interface GetAccountRequest {
    account: Account;
}

@Injectable()
export class GetAccountUseCase implements BaseUseCase<
    GetAccountRequest,
    GetAccountResponse
> {
    constructor(private readonly accountStockService: AccountStockService) {}

    async execute(request: GetAccountRequest): Promise<GetAccountResponse> {
        const { account } = request;
        const { accountId } = account;

        const accountStocks =
            await this.accountStockService.getAccountStocks(accountId);

        return {
            data: {
                accountNumber: accountId,
                accountInfo: account,
                accountStocks: accountStocks.filter(
                    (stock) => Number(stock.quantity) > 0,
                ),
            },
        };
    }
}
