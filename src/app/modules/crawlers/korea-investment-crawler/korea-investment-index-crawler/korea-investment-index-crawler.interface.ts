import { ApiProperty } from '@nestjs/swagger';

export interface KoreaInvestmentDomesticInquireIndexDailyPriceParam {
    /**
     * FID 기간 분류 코드
     * D:일별, W:주별, M:월별
     */
    FID_PERIOD_DIV_CODE: string;

    /**
     * FID 조건 시장 분류 코드
     * 시장구분코드 (업종 U)
     */
    FID_COND_MRKT_DIV_CODE: string;

    /**
     * FID 입력 종목코드
     * 코스피(0001), 코스닥(1001), 코스피200(2001)
     */
    FID_INPUT_ISCD: string;

    /**
     * FID 입력 날짜1
     * 입력 날짜 (YYYYMMDD)
     */
    FID_INPUT_DATE_1: string;
}

export class KoreaInvestmentDomesticInquireIndexDailyPriceOutput {
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
        description: '연중업종지수최고가',
    })
    dryy_bstp_nmix_hgpr: string;

    @ApiProperty({
        type: String,
        description: '연중업종지수최저가',
    })
    dryy_bstp_nmix_lwpr: string;
}

export class KoreaInvestmentDomesticInquireIndexDailyPriceOutput2 {
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

export interface OverseasQuotationInquireDailyChartPriceParam {
    /**
     * FID 조건 시장 분류 코드
     * N: 해외지수, X 환율, I: 국채, S:금선물
     */
    FID_COND_MRKT_DIV_CODE: string;

    /**
     * FID 입력 종목코드
     * 종목코드
     * ※ 해외주식 마스터 코드 참조
     * (포럼 > FAQ > 종목정보 다운로드(해외) > 해외지수)
     *
     * ※ 해당 API로 미국주식 조회 시, 다우30, 나스닥100, S&P500 종목만 조회 가능합니다. 더 많은 미국주식 종목 시세를 이용할 시에는, 해외주식기간별시세 API 사용 부탁드립니다.
     */
    FID_INPUT_ISCD: string;

    /**
     * FID 입력 날짜1
     * 시작일자(YYYYMMDD)
     */
    FID_INPUT_DATE_1: string;

    /**
     * FID 입력 날짜2
     * 종료일자(YYYYMMDD)
     */
    FID_INPUT_DATE_2: string;

    /**
     * FID 기간 분류 코드
     * D:일, W:주, M:월, Y:년
     */
    FID_PERIOD_DIV_CODE: string;
}

export interface OverseasQuotationInquireDailyChartPriceOutput {
    /**
     *  전일 대비
     */
    ovrs_nmix_prdy_vrss: string;

    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 전일 대비율
     */
    prdy_ctrt: string;

    /**
     * 전일 종가
     */
    ovrs_nmix_prdy_clpr: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * HTS 한글 종목명
     */
    hts_kor_isnm: string;

    /**
     * 현재가
     */
    ovrs_nmix_prpr: string;

    /**
     * 단축 종목코드
     */
    stck_shrn_iscd: string;

    /**
     * 전일 거래량
     */
    prdy_vol: string;

    /**
     * 시가
     */
    ovrs_prod_oprc: string;

    /**
     * 최고가
     */
    ovrs_prod_hgpr: string;

    /**
     * 최저가
     */
    ovrs_prod_lwpr: string;
}

export interface OverseasQuotationInquireDailyChartPriceOutput2 {
    /**
     * 영업 일자
     */
    stck_bsop_date: string;

    /**
     * 현재가
     */
    ovrs_nmix_prpr: string;

    /**
     * 시가
     */
    ovrs_nmix_oprc: string;

    /**
     * 최고가
     */
    ovrs_nmix_hgpr: string;

    /**
     * 최저가
     */
    ovrs_nmix_lwpr: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 변경 여부
     */
    mod_yn: string;
}
