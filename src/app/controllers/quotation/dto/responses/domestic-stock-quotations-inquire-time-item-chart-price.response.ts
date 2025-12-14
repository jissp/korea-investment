import { ApiProperty } from '@nestjs/swagger';
import {
    DomesticStockQuotationsInquireTimeItemChartPriceOutput,
    DomesticStockQuotationsInquireTimeItemChartPriceOutput2,
} from '@modules/korea-investment/korea-investment-quotation-client';

class DomesticStockQuotationsInquireTimeItemChartPrice implements DomesticStockQuotationsInquireTimeItemChartPriceOutput {
    @ApiProperty({
        type: String,
        description: ' 전일 대비 전일 대비 변동 (+-변동차이)',
    })
    prdy_vrss: string;

    @ApiProperty({
        type: String,
        description: '전일 대비 부호 ',
    })
    prdy_vrss_sign: string;

    @ApiProperty({
        type: String,
        description: '전일 대비율 소수점 두자리까지 제공 ',
    })
    prdy_ctrt: string;

    @ApiProperty({
        type: String,
        description: '전일대비 종가 ',
    })
    stck_prdy_clpr: string;

    @ApiProperty({
        type: String,
        description: '누적 거래량 ',
    })
    acml_vol: string;

    @ApiProperty({
        type: String,
        description: '누적 거래대금 ',
    })
    acml_tr_pbmn: string;

    @ApiProperty({
        type: String,
        description: '한글 종목명 한글 종목명 (HTS 기준) ',
    })
    hts_kor_isnm: string;

    @ApiProperty({
        type: String,
        description: '주식 현재가 ',
    })
    stck_prpr: string;
}

class DomesticStockQuotationsInquireTimeItemChartPrice2 implements DomesticStockQuotationsInquireTimeItemChartPriceOutput2 {
    @ApiProperty({
        type: String,
        description: '주식 영업일자 ',
    })
    stck_bsop_date: string;

    @ApiProperty({
        type: String,
        description: '주식 체결시간 ',
    })
    stck_cntg_hour: string;

    @ApiProperty({
        type: String,
        description: '주식 현재가 ',
    })
    stck_prpr: string;

    @ApiProperty({
        type: String,
        description: '주식 시가 ',
    })
    stck_oprc: string;

    @ApiProperty({
        type: String,
        description: '주식 최고가 ',
    })
    stck_hgpr: string;

    @ApiProperty({
        type: String,
        description: '주식 최저가 ',
    })
    stck_lwpr: string;

    @ApiProperty({
        type: String,
        description: '체결 거래량 ',
    })
    cntg_vol: string;

    @ApiProperty({
        type: String,
        description: '누적 거래대금 ',
    })
    acml_tr_pbmn: string;
}

export class DomesticStockQuotationsInquireTimeItemChartPriceData {
    @ApiProperty({
        type: DomesticStockQuotationsInquireTimeItemChartPrice,
    })
    data1: DomesticStockQuotationsInquireTimeItemChartPrice;

    @ApiProperty({
        type: DomesticStockQuotationsInquireTimeItemChartPrice2,
        isArray: true,
    })
    data2: DomesticStockQuotationsInquireTimeItemChartPrice2[];
}

export class DomesticStockQuotationsInquireTimeItemChartPriceResponse {
    @ApiProperty({
        type: DomesticStockQuotationsInquireTimeItemChartPriceData,
    })
    data: DomesticStockQuotationsInquireTimeItemChartPriceData;
}
