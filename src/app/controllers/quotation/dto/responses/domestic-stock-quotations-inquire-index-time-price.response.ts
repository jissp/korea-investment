import { ApiProperty } from '@nestjs/swagger';
import { DomesticStockQuotationsInquireIndexTimePriceOutput } from '@modules/korea-investment/korea-investment-client/korea-investment-quotation-client';

export class DomesticStockQuotationsInquireIndexTimePrice implements DomesticStockQuotationsInquireIndexTimePriceOutput {
    @ApiProperty({
        type: String,
        description: '영업 시간',
    })
    bsop_hour: string;

    @ApiProperty({
        type: String,
        description: '업종 지수 현재가',
    })
    bstp_nmix_prpr: string;

    @ApiProperty({
        type: String,
        description: '업종 지수 전일 대비',
    })
    bstp_nmix_prdy_vrss: string;

    @ApiProperty({
        type: String,
        description: '전일 대비 부호',
    })
    prdy_vrss_sign: string;

    @ApiProperty({
        type: String,
        description: '업종 지수 전일 대비율',
    })
    bstp_nmix_prdy_ctrt: string;

    @ApiProperty({
        type: String,
        description: '누적 거래 대금',
    })
    acml_tr_pbmn: string;

    @ApiProperty({
        type: String,
        description: '누적 거래량',
    })
    acml_vol: string;

    @ApiProperty({
        type: String,
        description: '체결 거래량',
    })
    cntg_vol: string;
}

export class DomesticStockQuotationsInquireIndexTimePriceResponse {
    @ApiProperty({
        type: DomesticStockQuotationsInquireIndexTimePrice,
        isArray: true,
    })
    data: DomesticStockQuotationsInquireIndexTimePrice[];
}
