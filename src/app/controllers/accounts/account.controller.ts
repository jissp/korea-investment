import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { GetAccountsResponse } from './dto';
import { AccountRepository } from '@app/modules/repositories';
import { KoreaInvestmentSettingService } from '@app/modules/korea-investment-setting';

@Controller('v1/accounts')
export class AccountController {
    constructor(
        private readonly koreaInvestmentSettingService: KoreaInvestmentSettingService,
        private readonly accountRepository: AccountRepository,
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
        const accountNumbers =
            await this.koreaInvestmentSettingService.getAccountNumbers();

        const accountData = await Promise.all(
            accountNumbers.map(async (accountNumber) => {
                const accountStocks =
                    await this.accountRepository.getAccountStocks(
                        accountNumber,
                    );

                return {
                    accountNumber,
                    accountInfo:
                        await this.accountRepository.getAccountInfo(
                            accountNumber,
                        ),
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
