import { ApiProperty } from '@nestjs/swagger';
import { Account, AccountStock } from '@app/modules/repositories/account';

class GetAccountData {
    @ApiProperty({
        type: String,
        description: '계좌 번호',
    })
    accountNumber: string;

    @ApiProperty({
        type: Account,
        description: '계좌 정보',
    })
    accountInfo: Account;

    @ApiProperty({
        type: AccountStock,
        description: '계좌 잔고 목록',
        isArray: true,
    })
    accountStocks: AccountStock[];
}

export class GetAccountResponse {
    @ApiProperty({
        type: GetAccountData,
    })
    data: GetAccountData;
}
