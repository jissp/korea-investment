import { ApiProperty } from '@nestjs/swagger';
import { DomesticStockQuotationInquireCcnlOutput } from '@modules/korea-investment/korea-investment-client/korea-investment-quotation-client';
import { IsString } from 'class-validator';

export class DomesticStockQuotationsInquireCcnlResponse implements DomesticStockQuotationInquireCcnlOutput {
    @ApiProperty({
        type: String,
        description: '주식 체결 시간',
    })
    @IsString()
    stck_cntg_hour: string;

    @ApiProperty({
        type: String,
        description: '주식 현재가',
    })
    @IsString()
    stck_prpr: string;

    @ApiProperty({
        type: String,
        description: '전일 대비',
    })
    @IsString()
    prdy_vrss: string;

    @ApiProperty({
        type: String,
        description: '전일 대비 부호',
    })
    @IsString()
    prdy_vrss_sign: string;

    @ApiProperty({
        type: String,
        description: '체결 거래량',
    })
    @IsString()
    cntg_vol: string;

    @ApiProperty({
        type: String,
        description: '당일 체결강도',
    })
    @IsString()
    tday_rltv: string;

    @ApiProperty({
        type: String,
        description: '전일 대비율',
    })
    @IsString()
    prdy_ctrt: string;
}
