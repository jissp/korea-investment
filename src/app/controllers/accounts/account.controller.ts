import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AuthGuard, CurrentAccount } from '@app/modules/auth';
import {
    Account,
    AccountStockService,
} from '@app/modules/repositories/account';
import { GetAccountResponse } from './dto';

@Controller('v1/accounts')
export class AccountController {
    constructor(private readonly accountStockService: AccountStockService) {}

    @ApiOperation({
        summary: '계좌 정보 조회',
        description: '계좌 정보를 조회합니다.',
    })
    @ApiOkResponse({
        type: GetAccountResponse,
    })
    @UseGuards(AuthGuard)
    @Get()
    public async getAccounts(
        @CurrentAccount() account: Account,
    ): Promise<GetAccountResponse> {
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
