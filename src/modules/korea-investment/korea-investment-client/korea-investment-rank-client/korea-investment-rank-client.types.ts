import { MarketDivCode } from '@modules/korea-investment/common';

export interface DomesticStockQuotationVolumeRankParam {
    /**
     * 조건 시장 분류 코드
     * J:KRX
     * NX:NXT
     */
    FID_COND_MRKT_DIV_CODE: MarketDivCode;

    /**
     * 조건 화면 분류 코드 20171
     */
    FID_COND_SCR_DIV_CODE?: string;

    /**
     * 입력 종목코드
     * 0000(전체)
     * 기타(업종코드)
     */
    FID_INPUT_ISCD?: string;

    /**
     * 분류 구분 코드
     * 0(전체)
     * 1(보통주)
     * 2(우선주)
     */
    FID_DIV_CLS_CODE?: string;

    /**
     * 소속 구분 코드
     * 0:평균거래량
     * 1:거래증가율
     * 2:평균거래회전율
     * 3:거래금액순
     * 4:평균거래금액회전율
     */
    FID_BLNG_CLS_CODE: string;

    /**
     * 대상 구분 코드
     * 1 or 0 9자리
     * (차례대로 증거금 30% 40% 50% 60% 100% 신용보증금 30% 40% 50% 60%)
     * ex) "111111111"
     */
    FID_TRGT_CLS_CODE: string;

    /**
     * 대상 제외 구분 코드
     * 1 or 0 10자리
     * (차례대로 투자위험/경고/주의 관리종목 정리매매 불성실공시 우선주 거래정지 ETF ETN 신용주문불가 SPAC)
     * ex) "0000000000"
     */
    FID_TRGT_EXLS_CLS_CODE: string;

    /**
     * 입력 가격1 가격 ~
     * ex) "0" 전체 가격 대상 조회 시 FID_INPUT_PRICE_1, FID_INPUT_PRICE_2 모두 ""(공란) 입력
     */
    FID_INPUT_PRICE_1?: string;

    /**
     * 입력 가격2 ~ 가격
     * ex) "1000000" 전체 가격 대상 조회 시 FID_INPUT_PRICE_1, FID_INPUT_PRICE_2 모두 ""(공란) 입력
     */
    FID_INPUT_PRICE_2?: string;

    /**
     * 거래량 수 거래량 ~
     * ex) "100000" 전체 거래량 대상 조회 시 FID_VOL_CNT ""(공란) 입력
     */
    FID_VOL_CNT?: string;

    /**
     * 입력 날짜1
     * ""(공란) 입력
     */
    FID_INPUT_DATE_1?: string;
}

export interface DomesticStockQuotationVolumeRankOutput {
    /**
     * HTS 한글 종목명
     */
    hts_kor_isnm: string;

    /**
     * 유가증권 단축 종목코드
     */
    mksc_shrn_iscd: string;

    /**
     * 데이터 순위
     */
    data_rank: string;

    /**
     * 주식 현재가
     */
    stck_prpr: string;

    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 전일 대비
     */
    prdy_vrss: string;

    /**
     * 전일 대비율
     */
    prdy_ctrt: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 전일 거래량
     */
    prdy_vol: string;

    /**
     * 상장 주수
     */
    lstn_stcn: string;

    /**
     * 평균 거래량
     */
    avrg_vol: string;

    /**
     * N일전종가대비현재가대비율
     */
    n_befr_clpr_vrss_prpr_rate: string;

    /**
     * 거래량증가율
     */
    vol_inrt: string;

    /**
     * 거래량 회전율
     */
    vol_tnrt: string;

    /**
     * N일 거래량 회전율
     */
    nday_vol_tnrt: string;

    /**
     * 평균 거래 대금
     */
    avrg_tr_pbmn: string;

    /**
     * 거래대금회전율
     */
    tr_pbmn_tnrt: string;

    /**
     * N일 거래대금 회전율
     */
    nday_tr_pbmn_tnrt: string;

    /**
     * 누적 거래 대금
     */
    acml_tr_pbmn: string;
}

export interface DomesticStockRankingFluctuationParam {
    /**
     * 조건 시장 분류 코드.
     * 시장구분코드 (J:KRX, NX:NXT)
     */
    fid_cond_mrkt_div_code: MarketDivCode;

    /**
     * 조건 화면 분류 코드.
     * Unique key( 20170 )
     */
    fid_cond_scr_div_code?: string;

    /**
     * 입력 종목코드.
     * 0000(전체) 코스피(0001), 코스닥(1001), 코스피200(2001)
     */
    fid_input_iscd?: string;

    /**
     * 입력 수1.
     * 0:전체 , 누적일수 입력
     */
    fid_input_cnt_1?: string;

    /**
     * 순위 정렬 구분 코드.
     * 0:상승율순
     * 1:하락율순
     * 2:시가대비상승율
     * 3:시가대비하락율
     * 4:변동율
     */
    fid_rank_sort_cls_code: string;

    /**
     * 등락 비율1.
     * 공백 입력 시 전체 (비율 ~)
     */
    fid_rsfl_rate1?: string;

    /**
     * 등락 비율2.
     * 공백 입력 시 전체 (~ 비율)
     */
    fid_rsfl_rate2?: string;

    /**
     * 가격 구분 코드.
     * fid_rank_sort_cls_code: 0 상승율 순일때 (0:저가대비, 1:종가대비)
     * fid_rank_sort_cls_code: 1 하락율 순일때 (0:고가대비, 1:종가대비)
     * fid_rank_sort_cls_code: 기타 (0:전체)
     */
    fid_prc_cls_code: string;

    /**
     * 입력 가격1. 공백 입력 시 전체 (가격 ~)
     */
    fid_input_price_1?: string;

    /**
     * 입력 가격2. 공백 입력 시 전체 (~ 가격)
     */
    fid_input_price_2?: string;

    /**
     * 거래량 수. 공백 입력 시 전체 (거래량 ~)
     */
    fid_vol_cnt?: string;

    /**
     * 대상 구분 코드.
     * 0:전체
     */
    fid_trgt_cls_code?: string;

    /**
     * 대상 제외 구분 코드.
     * 0:전체
     */
    fid_trgt_exls_cls_code?: string;

    /**
     * 분류 구분 코드.
     * 0:전체
     */
    fid_div_cls_code?: string;
}

export interface DomesticStockRankingFluctuationOutput {
    /**
     * 주식 단축 종목코드
     */
    stck_shrn_iscd: string;

    /**
     * 데이터 순위
     */
    data_rank: string;

    /**
     * HTS 한글 종목명
     */
    hts_kor_isnm: string;

    /**
     * 주식 현재가
     */
    stck_prpr: string;

    /**
     * 전일 대비
     */
    prdy_vrss: string;

    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 전일 대비율
     */
    prdy_ctrt: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 주식 최고가
     */
    stck_hgpr: string;

    /**
     * 최고가 시간
     */
    hgpr_hour: string;

    /**
     * 누적 최고가 일자
     */
    acml_hgpr_date: string;

    /**
     * 주식 최저가
     */
    stck_lwpr: string;

    /**
     * 최저가 시간
     */
    lwpr_hour: string;

    /**
     * 누적 최저가 일자
     */
    acml_lwpr_date: string;

    /**
     * 최저가 대비 현재가 비율
     */
    lwpr_vrss_prpr_rate: string;

    /**
     * 지정 일자 종가 대비 현재가 비
     */
    dsgt_date_clpr_vrss_prpr_rate: string;

    /**
     * 연속 상승 일수
     */
    cnnt_ascn_dynu: string;

    /**
     * 최고가 대비 현재가 비율
     */
    hgpr_vrss_prpr_rate: string;

    /**
     * 연속 하락 일수
     */
    cnnt_down_dynu: string;

    /**
     * 시가2 대비 현재가 부호
     */
    oprc_vrss_prpr_sign: string;

    /**
     * 시가2 대비 현재가
     */
    oprc_vrss_prpr: string;

    /**
     * 시가2 대비 현재가 비율
     */
    oprc_vrss_prpr_rate: string;

    /**
     * 기간 등락
     */
    prd_rsfl: string;

    /**
     * 기간 등락 비율
     */
    prd_rsfl_rate: string;
}

export interface DomesticStockRankingHtsTopViewOutput {
    /**
     * 시장구분
     * J : 코스피, Q : 코스닥
     */
    mrkt_div_cls_code: 'J' | 'Q';

    /**
     * 종목코드
     */
    mksc_shrn_iscd: string;
}

export interface DomesticStockRankingShortSaleParam {
    /**
     * FID 적용 범위 거래량
     */
    FID_APLY_RANG_VOL: string;

    /**
     * 조건 시장 분류 코드
     */
    FID_COND_MRKT_DIV_CODE: string;

    /**
     * 조건 화면 분류 코드
     */
    FID_COND_SCR_DIV_CODE: string;

    /**
     * 입력 종목코드
     * 0000: 전체
     * 0001: 코스피
     * 1001: 코스닥
     * 2001: 코스피200
     * 4001: KRX100
     * 3003: 코스닥150
     */
    FID_INPUT_ISCD: string;

    /**
     * 조회구분 (일/월)
     * D: 일
     * M:월
     */
    FID_PERIOD_DIV_CODE: string;

    /**
     * 조회가간(일수)
     * 조회구분(D) 0:1일, 1:2일, 2:3일, 3:4일, 4:1주일, 9:2주일, 14:3주일,
     * 조회구분(M) 1:1개월, 2:2개월, 3:3개월'
     */
    FID_INPUT_CNT_1: string;

    /**
     * 대상 제외 구분 코드
     */
    FID_TRGT_EXLS_CLS_CODE: string;

    /**
     * FID 대상 구분 코드
     */
    FID_TRGT_CLS_CODE: string;

    /**
     * FID 적용 범위 가격1
     */
    FID_APLY_RANG_PRC_1: string;

    /**
     * FID 적용 범위 가격2
     */
    FID_APLY_RANG_PRC_2: string;
}

export interface DomesticStockRankingShortSaleOutput {
    /**
     * 유가증권 단축 종목코드
     */
    mksc_shrn_iscd: string;

    /**
     * HTS 한글 종목명
     */
    hts_kor_isnm: string;

    /**
     * 주식 현재가
     */
    stck_prpr: string;

    /**
     * 전일 대비
     */
    prdy_vrss: string;

    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 전일 대비율
     */
    prdy_ctrt: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 누적 거래 대금
     */
    acml_tr_pbmn: string;

    /**
     * 공매도 체결 수량
     */
    ssts_cntg_qty: string;

    /**
     * 공매도 거래량 비중
     */
    ssts_vol_rlim: string;

    /**
     * 공매도 거래 대금
     */
    ssts_tr_pbmn: string;

    /**
     * 공매도 거래대금 비중
     */
    ssts_tr_pbmn_rlim: string;

    /**
     * 기준 일자1
     */
    stnd_date1: string;

    /**
     * 기준 일자2
     */
    stnd_date2: string;

    /**
     * 평균가격
     */
    avrg_prc: string;
}
