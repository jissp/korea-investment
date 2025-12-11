import { ApiProperty } from '@nestjs/swagger';
import { DomesticStockQuotationInquireIndexPriceOutput } from '@modules/korea-investment/korea-investment-client/korea-investment-quotation-client';

class DomesticStockQuotationsInquireIndexPrice implements DomesticStockQuotationInquireIndexPriceOutput {
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
        description: '전일 거래량',
    })
    prdy_vol: string;

    @ApiProperty({
        type: String,
        description: '누적 거래 대금',
    })
    acml_tr_pbmn: string;

    @ApiProperty({
        type: String,
        description: '전일 거래 대금',
    })
    prdy_tr_pbmn: string;

    @ApiProperty({
        type: String,
        description: '업종 지수 시가2',
    })
    bstp_nmix_oprc: string;

    @ApiProperty({
        type: String,
        description: '전일 지수 대비 지수 시가2',
    })
    prdy_nmix_vrss_nmix_oprc: string;

    @ApiProperty({
        type: String,
        description: '시가2 대비 현재가 부호',
    })
    oprc_vrss_prpr_sign: string;

    @ApiProperty({
        type: String,
        description: '업종 지수 시가2 전일 대비율',
    })
    bstp_nmix_oprc_prdy_ctrt: string;

    @ApiProperty({
        type: String,
        description: '업종 지수 최고가',
    })
    bstp_nmix_hgpr: string;

    @ApiProperty({
        type: String,
        description: '전일 지수 대비 지수 최고가',
    })
    prdy_nmix_vrss_nmix_hgpr: string;

    @ApiProperty({
        type: String,
        description: '최고가 대비 현재가 부호',
    })
    hgpr_vrss_prpr_sign: string;

    @ApiProperty({
        type: String,
        description: '업종 지수 최고가 전일 대비율',
    })
    bstp_nmix_hgpr_prdy_ctrt: string;

    @ApiProperty({
        type: String,
        description: '업종 지수 최저가',
    })
    bstp_nmix_lwpr: string;

    @ApiProperty({
        type: String,
        description: '전일 종가 대비 최저가',
    })
    prdy_clpr_vrss_lwpr: string;

    @ApiProperty({
        type: String,
        description: '최저가 대비 현재가 부호',
    })
    lwpr_vrss_prpr_sign: string;

    @ApiProperty({
        type: String,
        description: '전일 종가 대비 최저가 비율',
    })
    prdy_clpr_vrss_lwpr_rate: string;

    @ApiProperty({
        type: String,
        description: '상승 종목 수',
    })
    ascn_issu_cnt: string;

    @ApiProperty({
        type: String,
        description: '상한 종목 수',
    })
    uplm_issu_cnt: string;

    @ApiProperty({
        type: String,
        description: '보합 종목 수',
    })
    stnr_issu_cnt: string;

    @ApiProperty({
        type: String,
        description: '하락 종목 수',
    })
    down_issu_cnt: string;

    @ApiProperty({
        type: String,
        description: '하한 종목 수',
    })
    lslm_issu_cnt: string;

    @ApiProperty({
        type: String,
        description: '연중업종지수최고가',
    })
    dryy_bstp_nmix_hgpr: string;

    @ApiProperty({
        type: String,
        description: '연중 최고가 대비 현재가 비율',
    })
    dryy_hgpr_vrss_prpr_rate: string;

    @ApiProperty({
        type: String,
        description: '연중업종지수최고가일자',
    })
    dryy_bstp_nmix_hgpr_date: string;

    @ApiProperty({
        type: String,
        description: '연중업종지수최저가',
    })
    dryy_bstp_nmix_lwpr: string;

    @ApiProperty({
        type: String,
        description: '연중 최저가 대비 현재가 비율',
    })
    dryy_lwpr_vrss_prpr_rate: string;

    @ApiProperty({
        type: String,
        description: '연중업종지수최저가일자',
    })
    dryy_bstp_nmix_lwpr_date: string;

    @ApiProperty({
        type: String,
        description: '총 매도호가 잔량',
    })
    total_askp_rsqn: string;

    @ApiProperty({
        type: String,
        description: '총 매수호가 잔량',
    })
    total_bidp_rsqn: string;

    @ApiProperty({
        type: String,
        description: '매도 잔량 비율',
    })
    seln_rsqn_rate: string;

    @ApiProperty({
        type: String,
        description: '매수2 잔량 비율',
    })
    shnu_rsqn_rate: string;

    @ApiProperty({
        type: String,
        description: '순매수 잔량',
    })
    ntby_rsqn: string;
}

export class DomesticStockQuotationsInquireIndexPriceResponse {
    @ApiProperty({
        type: DomesticStockQuotationsInquireIndexPrice,
    })
    data: DomesticStockQuotationsInquireIndexPrice;
}
