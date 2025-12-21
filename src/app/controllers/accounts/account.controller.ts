import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { KoreaInvestmentAccountService } from '@app/modules/korea-investment-account';
import { GetAccountsResponse } from './dto';

@Controller('v1/accounts')
export class AccountController {
    constructor(
        private readonly accountService: KoreaInvestmentAccountService,
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
        const accountNumbers = await this.accountService.getAccountNumbers();

        const accountData = await Promise.all(
            accountNumbers.map(async (accountNumber) => {
                const accountStocks =
                    await this.accountService.getAccountStocks(accountNumber);

                return {
                    accountNumber,
                    accountInfo:
                        await this.accountService.getAccountInfo(accountNumber),
                    accountStocks: accountStocks.filter(
                        (stock) => Number(stock.hldg_qty) > 0,
                    ),
                };
            }),
        );

        return {
            data: accountData,
        };
    }
}
