import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import {
    AccountService,
    AccountStockService,
} from '@app/modules/repositories/account';
import { GetAccountsResponse } from './dto';

@Controller('v1/accounts')
export class AccountController {
    constructor(
        private readonly accountService: AccountService,
        private readonly accountStockService: AccountStockService,
    ) {}

    @ApiOperation({
        summary: '계좌 정보 조회',
        description: '계좌 정보를 조회합니다.',
    })
    @ApiOkResponse({
        type: GetAccountsResponse,
    })
    @Get()
    public async getAccounts(): Promise<GetAccountsResponse> {
        const accounts = await this.accountService.getAccounts();

        const results = await Promise.all(
            accounts.map(async (account) => {
                const { accountId } = account;

                const accountStocks =
                    await this.accountStockService.getAccountStocks(accountId);

                return {
                    accountNumber: accountId,
                    accountInfo: account,
                    accountStocks: accountStocks.filter(
                        (stock) => Number(stock.quantity) > 0,
                    ),
                };
            }),
        );

        return {
            data: results.flat(),
        };
    }
}
