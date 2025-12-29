import { ApiProperty } from '@nestjs/swagger';
import {
    KoreaInvestmentAccountOutput2,
    KoreaInvestmentAccountStockOutput,
} from '@app/modules/korea-investment-request-api';

class GetAccountInfo extends KoreaInvestmentAccountOutput2 {}

class GetAccountStock extends KoreaInvestmentAccountStockOutput {}

class GetAccountData {
    @ApiProperty({
        type: String,
        description: '계좌 번호',
    })
    accountNumber: string;

    @ApiProperty({
        type: GetAccountInfo,
        description: '계좌 정보',
    })
    accountInfo: GetAccountInfo;

    @ApiProperty({
        type: GetAccountStock,
        description: '계좌 잔고 목록',
        isArray: true,
    })
    accountStocks: GetAccountStock[];
}

export class GetAccountsResponse {
    @ApiProperty({
        type: GetAccountData,
        isArray: true,
    })
    data: GetAccountData[];
}
