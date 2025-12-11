import { ApiProperty } from '@nestjs/swagger';
import { DomesticStockQuotationInquireCcnlOutput } from '@modules/korea-investment/korea-investment-client/korea-investment-quotation-client';

class DomesticStockQuotationsInquireCcnl implements DomesticStockQuotationInquireCcnlOutput {
    @ApiProperty({
        type: String,
        description: '주식 체결 시간',
    })
    stck_cntg_hour: string;

    @ApiProperty({
        type: String,
        description: '주식 현재가',
    })
    stck_prpr: string;

    @ApiProperty({
        type: String,
        description: '전일 대비',
    })
    prdy_vrss: string;

    @ApiProperty({
        type: String,
        description: '전일 대비 부호',
    })
    prdy_vrss_sign: string;

    @ApiProperty({
        type: String,
        description: '체결 거래량',
    })
    cntg_vol: string;

    @ApiProperty({
        type: String,
        description: '당일 체결강도',
    })
    tday_rltv: string;

    @ApiProperty({
        type: String,
        description: '전일 대비율',
    })
    prdy_ctrt: string;
}

export class DomesticStockQuotationsInquireCcnlResponse {
    @ApiProperty({
        type: DomesticStockQuotationsInquireCcnl,
        isArray: true,
    })
    data: DomesticStockQuotationsInquireCcnl[];
}
