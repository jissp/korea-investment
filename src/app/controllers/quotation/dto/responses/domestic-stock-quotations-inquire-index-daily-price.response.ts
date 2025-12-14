import { ApiProperty } from '@nestjs/swagger';
import {
    DomesticStockQuotationsInquireIndexDailyPriceOutput,
    DomesticStockQuotationsInquireIndexDailyPriceOutput2,
} from '@modules/korea-investment/korea-investment-quotation-client';

class DomesticStockQuotationsInquireIndexDailyPrice implements DomesticStockQuotationsInquireIndexDailyPriceOutput {
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
        description: '누적 거래량',
    })
    acml_vol: string;

    @ApiProperty({
        type: String,
        description: '누적 거래 대금',
    })
    acml_tr_pbmn: string;

    @ApiProperty({
        type: String,
        description: '업종 지수 시가2',
    })
    bstp_nmix_oprc: string;

    @ApiProperty({
        type: String,
        description: '업종 지수 최고가',
    })
    bstp_nmix_hgpr: string;

    @ApiProperty({
        type: String,
        description: '업종 지수 최저가',
    })
    bstp_nmix_lwpr: string;

    @ApiProperty({
        type: String,
        description: '전일 거래량',
    })
    prdy_vol: string;

    @ApiProperty({
        type: String,
        description: '상승 종목 수',
    })
    ascn_issu_cnt: string;

    @ApiProperty({
        type: String,
        description: '하락 종목 수',
    })
    down_issu_cnt: string;

    @ApiProperty({
        type: String,
        description: '보합 종목 수',
    })
    stnr_issu_cnt: string;

    @ApiProperty({
        type: String,
        description: '상한 종목 수',
    })
    uplm_issu_cnt: string;

    @ApiProperty({
        type: String,
        description: '하한 종목 수',
    })
    lslm_issu_cnt: string;

    @ApiProperty({
        type: String,
        description: '전일 거래 대금',
    })
    prdy_tr_pbmn: string;

    @ApiProperty({
        type: String,
        description: '연중업종지수최고가일자',
    })
    dryy_bstp_nmix_hgpr_date: string;

    @ApiProperty({
        type: String,
        description: '연중업종지수최고가',
    })
    dryy_bstp_nmix_hgpr: string;

    @ApiProperty({
        type: String,
        description: '연중업종지수최저가',
    })
    dryy_bstp_nmix_lwpr: string;

    @ApiProperty({
        type: String,
        description: '연중업종지수최저가일자',
    })
    dryy_bstp_nmix_lwpr_date: string;
}

class DomesticStockQuotationsInquireIndexDailyPrice2 implements DomesticStockQuotationsInquireIndexDailyPriceOutput2 {
    @ApiProperty({
        type: String,
        description: '주식 영업 일자',
    })
    stck_bsop_date: string;

    @ApiProperty({
        type: String,
        description: '업종 지수 현재가',
    })
    bstp_nmix_prpr: string;

    @ApiProperty({
        type: String,
        description: '전일 대비 부호',
    })
    prdy_vrss_sign: string;

    @ApiProperty({
        type: String,
        description: '업종 지수 전일 대비',
    })
    bstp_nmix_prdy_vrss: string;

    @ApiProperty({
        type: String,
        description: '업종 지수 전일 대비율',
    })
    bstp_nmix_prdy_ctrt: string;

    @ApiProperty({
        type: String,
        description: '업종 지수 시가2',
    })
    bstp_nmix_oprc: string;

    @ApiProperty({
        type: String,
        description: '업종 지수 최고가',
    })
    bstp_nmix_hgpr: string;

    @ApiProperty({
        type: String,
        description: '업종 지수 최저가',
    })
    bstp_nmix_lwpr: string;

    @ApiProperty({
        type: String,
        description: '누적 거래량 비중',
    })
    acml_vol_rlim: string;

    @ApiProperty({
        type: String,
        description: '누적 거래량',
    })
    acml_vol: string;

    @ApiProperty({
        type: String,
        description: '누적 거래 대금',
    })
    acml_tr_pbmn: string;

    @ApiProperty({
        type: String,
        description: '투자 신 심리도',
    })
    invt_new_psdg: string;

    @ApiProperty({
        type: String,
        description: '20일 이격도',
    })
    d20_dsrt: string;
}

export class DomesticStockQuotationsInquireIndexDailyPriceData {
    @ApiProperty({
        type: DomesticStockQuotationsInquireIndexDailyPrice,
    })
    data1: DomesticStockQuotationsInquireIndexDailyPrice;

    @ApiProperty({
        type: DomesticStockQuotationsInquireIndexDailyPrice2,
        isArray: true,
    })
    data2: DomesticStockQuotationsInquireIndexDailyPrice2[];
}

export class DomesticStockQuotationsInquireIndexDailyPriceResponse {
    @ApiProperty({
        type: DomesticStockQuotationsInquireIndexDailyPriceData,
        isArray: true,
    })
    data: DomesticStockQuotationsInquireIndexDailyPriceData;
}
