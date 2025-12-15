export interface DomesticStockQuotationInquirePrice2Output {
    /**
     * 대표 시장 한글 명
     */
    rprs_mrkt_kor_name: string;

    /**
     * 신 고가 저가 구분 코드	특정 경우에만 데이터 출력
     */
    new_hgpr_lwpr_cls_code: string;

    /**
     * 상하한가 구분 코드	특정 경우에만 데이터 출력
     */
    mxpr_llam_cls_code: string;

    /**
     * 신용 가능 여부
     */
    crdt_able_yn: string;

    /**
     * 주식 상한가
     */
    stck_mxpr: string;

    /**
     * ELW 발행 여부
     */
    elw_pblc_yn: string;

    /**
     * 전일 종가 대비 시가2 비율
     */
    prdy_clpr_vrss_oprc_rate: string;

    /**
     * 신용 비율
     */
    crdt_rate: string;

    /**
     * 증거금 비율
     */
    marg_rate: string;

    /**
     * 최저가 대비 현재가
     */
    lwpr_vrss_prpr: string;

    /**
     * 최저가 대비 현재가 부호
     */
    lwpr_vrss_prpr_sign: string;

    /**
     * 전일 종가 대비 최저가 비율
     */
    prdy_clpr_vrss_lwpr_rate: string;

    /**
     * 주식 최저가
     */
    stck_lwpr: string;

    /**
     * 최고가 대비 현재가
     */
    hgpr_vrss_prpr: string;

    /**
     * 최고가 대비 현재가 부호
     */
    hgpr_vrss_prpr_sign: string;

    /**
     * 전일 종가 대비 최고가 비율
     */
    prdy_clpr_vrss_hgpr_rate: string;

    /**
     * 주식 최고가
     */
    stck_hgpr: string;

    /**
     * 시가2 대비 현재가
     */
    oprc_vrss_prpr: string;

    /**
     * 시가2 대비 현재가 부호
     */
    oprc_vrss_prpr_sign: string;

    /**
     * 관리 종목 여부
     */
    mang_issu_yn: string;

    /**
     * 동시호가배분처리코드	11:매수상한배분 12:매수하한배분 13: 매도상한배분 14:매도하한배분
     */
    divi_app_cls_code: string;

    /**
     * 단기과열여부
     */
    short_over_yn: string;

    /**
     * 시장경고코드	00: 없음 01: 투자주의 02:투자경고 03:투자위험
     */
    mrkt_warn_cls_code: string;

    /**
     * 투자유의여부
     */
    invt_caful_yn: string;

    /**
     * 이상급등여부
     */
    stange_runup_yn: string;

    /**
     * 공매도과열 여부
     */
    ssts_hot_yn: string;

    /**
     * 저유동성 종목 여부
     */
    low_current_yn: string;

    /**
     * VI적용구분코드
     */
    vi_cls_code: string;

    /**
     * 단기과열구분코드
     */
    short_over_cls_code: string;

    /**
     * 주식 하한가
     */
    stck_llam: string;

    /**
     * 신규 상장 구분 명
     */
    new_lstn_cls_name: string;

    /**
     * 임의 매매 구분 명
     */
    vlnt_deal_cls_name: string;

    /**
     * 락 구분 이름	특정 경우에만 데이터 출력
     */
    flng_cls_name: string;

    /**
     * 재평가 종목 사유 명	특정 경우에만 데이터 출력
     */
    revl_issu_reas_name: string;

    /**
     * 시장 경고 구분 명	특정 경우에만 데이터 출력"투자환기" / "투자경고"
     */
    mrkt_warn_cls_name: string;

    /**
     * 주식 기준가
     */
    stck_sdpr: string;

    /**
     * 업종 구분 코드
     */
    bstp_cls_code: string;

    /**
     * 주식 전일 종가
     */
    stck_prdy_clpr: string;

    /**
     * 불성실 공시 여부
     */
    insn_pbnt_yn: string;

    /**
     * 액면가 변경 구분 명	특정 경우에만 데이터 출력
     */
    fcam_mod_cls_name: string;

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
     * 누적 거래 대금
     */
    acml_tr_pbmn: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 전일 대비 거래량 비율
     */
    prdy_vrss_vol_rate: string;

    /**
     * 업종 한글 종목명	※ 거래소 정보로 특정 종목은 업종구분이 없어 데이터 미회신
     */
    bstp_kor_isnm: string;

    /**
     * 정리매매 여부
     */
    sltr_yn: string;

    /**
     * 거래정지 여부
     */
    trht_yn: string;

    /**
     * 시가 범위 연장 여부
     */
    oprc_rang_cont_yn: string;

    /**
     * 임의 종료 구분 코드
     */
    vlnt_fin_cls_code: string;

    /**
     * 주식 시가2
     */
    stck_oprc: string;

    /**
     * 전일 거래량
     */
    prdy_vol: string;
}

export interface DomesticStockQuotationInquireCcnlOutput {
    /**
     * 주식 체결 시간
     */
    stck_cntg_hour: string;

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
     * 체결 거래량
     */
    cntg_vol: string;

    /**
     * 당일 체결강도
     */
    tday_rltv: string;

    /**
     * 전일 대비율
     */
    prdy_ctrt: string;
}

export interface DomesticStockQuotationInquireIndexPriceOutput {
    /**
     * 업종 지수 현재가
     */
    bstp_nmix_prpr: string;

    /**
     * 업종 지수 전일 대비
     */
    bstp_nmix_prdy_vrss: string;

    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 업종 지수 전일 대비율
     */
    bstp_nmix_prdy_ctrt: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 전일 거래량
     */
    prdy_vol: string;

    /**
     * 누적 거래 대금
     */
    acml_tr_pbmn: string;

    /**
     * 전일 거래 대금
     */
    prdy_tr_pbmn: string;

    /**
     * 업종 지수 시가2
     */
    bstp_nmix_oprc: string;

    /**
     * 전일 지수 대비 지수 시가2
     */
    prdy_nmix_vrss_nmix_oprc: string;

    /**
     * 시가2 대비 현재가 부호
     */
    oprc_vrss_prpr_sign: string;

    /**
     * 업종 지수 시가2 전일 대비율
     */
    bstp_nmix_oprc_prdy_ctrt: string;

    /**
     * 업종 지수 최고가
     */
    bstp_nmix_hgpr: string;

    /**
     * 전일 지수 대비 지수 최고가
     */
    prdy_nmix_vrss_nmix_hgpr: string;

    /**
     * 최고가 대비 현재가 부호
     */
    hgpr_vrss_prpr_sign: string;

    /**
     * 업종 지수 최고가 전일 대비율
     */
    bstp_nmix_hgpr_prdy_ctrt: string;

    /**
     * 업종 지수 최저가
     */
    bstp_nmix_lwpr: string;

    /**
     * 전일 종가 대비 최저가
     */
    prdy_clpr_vrss_lwpr: string;

    /**
     * 최저가 대비 현재가 부호
     */
    lwpr_vrss_prpr_sign: string;

    /**
     * 전일 종가 대비 최저가 비율
     */
    prdy_clpr_vrss_lwpr_rate: string;

    /**
     * 상승 종목 수
     */
    ascn_issu_cnt: string;

    /**
     * 상한 종목 수
     */
    uplm_issu_cnt: string;

    /**
     * 보합 종목 수
     */
    stnr_issu_cnt: string;

    /**
     * 하락 종목 수
     */
    down_issu_cnt: string;

    /**
     * 하한 종목 수
     */
    lslm_issu_cnt: string;

    /**
     * 연중업종지수최고가
     */
    dryy_bstp_nmix_hgpr: string;

    /**
     * 연중 최고가 대비 현재가 비율
     */
    dryy_hgpr_vrss_prpr_rate: string;

    /**
     * 연중업종지수최고가일자
     */
    dryy_bstp_nmix_hgpr_date: string;

    /**
     * 연중업종지수최저가
     */
    dryy_bstp_nmix_lwpr: string;

    /**
     * 연중 최저가 대비 현재가 비율
     */
    dryy_lwpr_vrss_prpr_rate: string;

    /**
     * 연중업종지수최저가일자
     */
    dryy_bstp_nmix_lwpr_date: string;

    /**
     * 총 매도호가 잔량
     */
    total_askp_rsqn: string;

    /**
     * 총 매수호가 잔량
     */
    total_bidp_rsqn: string;

    /**
     * 매도 잔량 비율
     */
    seln_rsqn_rate: string;

    /**
     * 매수2 잔량 비율
     */
    shnu_rsqn_rate: string;

    /**
     * 순매수 잔량
     */
    ntby_rsqn: string;
}

export interface DomesticStockQuotationsInquireTimeItemChartPriceOutput {
    /**
     * 전일 대비
     * 전일 대비 변동 (+-변동차이)
     */
    prdy_vrss: string;
    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;
    /**
     * 전일 대비율
     * 소수점 두자리까지 제공
     */
    prdy_ctrt: string;
    /**
     * 전일대비 종가
     */
    stck_prdy_clpr: string;
    /**
     * 누적 거래량
     */
    acml_vol: string;
    /**
     * 누적 거래대금
     */
    acml_tr_pbmn: string;
    /**
     * 한글 종목명
     * 한글 종목명 (HTS 기준)
     */
    hts_kor_isnm: string;
    /**
     * 주식 현재가
     */
    stck_prpr: string;
}

export interface DomesticStockQuotationsInquireTimeItemChartPriceOutput2 {
    /**
     * 주식 영업일자
     */
    stck_bsop_date: string;

    /**
     * 주식 체결시간
     */
    stck_cntg_hour: string;

    /**
     * 주식 현재가
     */
    stck_prpr: string;

    /**
     * 주식 시가
     */
    stck_oprc: string;

    /**
     * 주식 최고가
     */
    stck_hgpr: string;

    /**
     * 주식 최저가
     */
    stck_lwpr: string;

    /**
     * 체결 거래량
     */
    cntg_vol: string;

    /**
     * 누적 거래대금
     */
    acml_tr_pbmn: string;
}

export interface DomesticStockQuotationsInquireIndexTimePriceOutput {
    /**
     * 영업 시간
     */
    bsop_hour: string;

    /**
     * 업종 지수 현재가
     */
    bstp_nmix_prpr: string;

    /**
     * 업종 지수 전일 대비
     */
    bstp_nmix_prdy_vrss: string;

    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 업종 지수 전일 대비율
     */
    bstp_nmix_prdy_ctrt: string;

    /**
     * 누적 거래 대금
     */
    acml_tr_pbmn: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 체결 거래량
     */
    cntg_vol: string;
}

export interface DomesticStockQuotationsInquireIndexDailyPriceParam {
    /**
     * FID 기간 분류 코드 - 일/주/월 구분코드 ( D:일별 , W:주별, M:월별 )
     */
    FID_PERIOD_DIV_CODE: string;

    /**
     * FID 조건 시장 분류 코드 - 시장구분코드 (업종 U)
     */
    FID_COND_MRKT_DIV_CODE: string;

    /**
     * FID 입력 종목코드 - 코스피(0001), 코스닥(1001), 코스피200(2001) ... 포탈 (FAQ : 종목정보 다운로드(국내) - 업종코드 참조)
     */
    FID_INPUT_ISCD: string;

    /**
     * FID 입력 날짜1 - 입력 날짜(ex. 20240223)
     */
    FID_INPUT_DATE_1: string;
}

export interface DomesticStockQuotationsInquireIndexDailyPriceOutput {
    /**
     * 업종 지수 현재가
     */
    bstp_nmix_prpr: string;

    /**
     * 업종 지수 전일 대비
     */
    bstp_nmix_prdy_vrss: string;

    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 업종 지수 전일 대비율
     */
    bstp_nmix_prdy_ctrt: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 누적 거래 대금
     */
    acml_tr_pbmn: string;

    /**
     * 업종 지수 시가2
     */
    bstp_nmix_oprc: string;

    /**
     * 업종 지수 최고가
     */
    bstp_nmix_hgpr: string;

    /**
     * 업종 지수 최저가
     */
    bstp_nmix_lwpr: string;

    /**
     * 전일 거래량
     */
    prdy_vol: string;

    /**
     * 상승 종목 수
     */
    ascn_issu_cnt: string;

    /**
     * 하락 종목 수
     */
    down_issu_cnt: string;

    /**
     * 보합 종목 수
     */
    stnr_issu_cnt: string;

    /**
     * 상한 종목 수
     */
    uplm_issu_cnt: string;

    /**
     * 하한 종목 수
     */
    lslm_issu_cnt: string;

    /**
     * 전일 거래 대금
     */
    prdy_tr_pbmn: string;

    /**
     * 연중업종지수최고가일자
     */
    dryy_bstp_nmix_hgpr_date: string;

    /**
     * 연중업종지수최고가
     */
    dryy_bstp_nmix_hgpr: string;

    /**
     * 연중업종지수최저가
     */
    dryy_bstp_nmix_lwpr: string;

    /**
     * 연중업종지수최저가일자
     */
    dryy_bstp_nmix_lwpr_date: string;
}

export interface DomesticStockQuotationsInquireIndexDailyPriceOutput2 {
    /**
     * 주식 영업 일자
     */
    stck_bsop_date: string;
    /**
     * 업종 지수 현재가
     */
    bstp_nmix_prpr: string;
    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;
    /**
     * 업종 지수 전일 대비
     */
    bstp_nmix_prdy_vrss: string;
    /**
     * 업종 지수 전일 대비율
     */
    bstp_nmix_prdy_ctrt: string;
    /**
     * 업종 지수 시가2
     */
    bstp_nmix_oprc: string;
    /**
     * 업종 지수 최고가
     */
    bstp_nmix_hgpr: string;
    /**
     * 업종 지수 최저가
     */
    bstp_nmix_lwpr: string;
    /**
     * 누적 거래량 비중
     */
    acml_vol_rlim: string;
    /**
     * 누적 거래량
     */
    acml_vol: string;
    /**
     * 누적 거래 대금
     */
    acml_tr_pbmn: string;
    /**
     * 투자 신 심리도
     */
    invt_new_psdg: string;
    /**
     * 20일 이격도
     */
    d20_dsrt: string;
}

export interface DomesticStockQuotationsInquireMemberParam {
    /**
     * FID 조건 시장 분류 코드
     * J:KRX, NX:NXT, UN:통합
     */
    FID_COND_MRKT_DIV_CODE: string;
    /**
     * FID 입력 종목코드
     * 종목번호 (6자리) ETN의 경우, Q로 시작 (EX. Q500001)
     */
    FID_INPUT_ISCD: string;
}

export interface DomesticStockQuotationsInquireMemberOutput {
    /**
     * 매도 회원사 번호1
     */
    seln_mbcr_no1: string;

    /**
     * 매도 회원사 번호2
     */
    seln_mbcr_no2: string;

    /**
     * 매도 회원사 번호3
     */
    seln_mbcr_no3: string;

    /**
     * 매도 회원사 번호4
     */
    seln_mbcr_no4: string;

    /**
     * 매도 회원사 번호5
     */
    seln_mbcr_no5: string;

    /**
     * 매도 회원사 명1
     */
    seln_mbcr_name1: string;

    /**
     * 매도 회원사 명2
     */
    seln_mbcr_name2: string;

    /**
     * 매도 회원사 명3
     */
    seln_mbcr_name3: string;

    /**
     * 매도 회원사 명4
     */
    seln_mbcr_name4: string;

    /**
     * 매도 회원사 명5
     */
    seln_mbcr_name5: string;

    /**
     * 총 매도 수량1
     */
    total_seln_qty1: string;

    /**
     * 총 매도 수량2
     */
    total_seln_qty2: string;

    /**
     * 총 매도 수량3
     */
    total_seln_qty3: string;

    /**
     * 총 매도 수량4
     */
    total_seln_qty4: string;

    /**
     * 총 매도 수량5
     */
    total_seln_qty5: string;

    /**
     * 매도 회원사 비중1
     */
    seln_mbcr_rlim1: string;

    /**
     * 매도 회원사 비중2
     */
    seln_mbcr_rlim2: string;

    /**
     * 매도 회원사 비중3
     */
    seln_mbcr_rlim3: string;

    /**
     * 매도 회원사 비중4
     */
    seln_mbcr_rlim4: string;

    /**
     * 매도 회원사 비중5
     */
    seln_mbcr_rlim5: string;

    /**
     * 매도 수량 증감1
     */
    seln_qty_icdc1: string;

    /**
     * 매도 수량 증감2
     */
    seln_qty_icdc2: string;

    /**
     * 매도 수량 증감3
     */
    seln_qty_icdc3: string;

    /**
     * 매도 수량 증감4
     */
    seln_qty_icdc4: string;

    /**
     * 매도 수량 증감5
     */
    seln_qty_icdc5: string;

    /**
     * 매수2 회원사 번호1
     */
    shnu_mbcr_no1: string;

    /**
     * 매수2 회원사 번호2
     */
    shnu_mbcr_no2: string;

    /**
     * 매수2 회원사 번호3
     */
    shnu_mbcr_no3: string;

    /**
     * 매수2 회원사 번호4
     */
    shnu_mbcr_no4: string;

    /**
     * 매수2 회원사 번호5
     */
    shnu_mbcr_no5: string;

    /**
     * 매수2 회원사 명1
     */
    shnu_mbcr_name1: string;

    /**
     * 매수2 회원사 명2
     */
    shnu_mbcr_name2: string;

    /**
     * 매수2 회원사 명3
     */
    shnu_mbcr_name3: string;

    /**
     * 매수2 회원사 명4
     */
    shnu_mbcr_name4: string;

    /**
     * 매수2 회원사 명5
     */
    shnu_mbcr_name5: string;

    /**
     * 총 매수2 수량1
     */
    total_shnu_qty1: string;

    /**
     * 총 매수2 수량2
     */
    total_shnu_qty2: string;

    /**
     * 총 매수2 수량3
     */
    total_shnu_qty3: string;

    /**
     * 총 매수2 수량4
     */
    total_shnu_qty4: string;

    /**
     * 총 매수2 수량5
     */
    total_shnu_qty5: string;

    /**
     * 매수2 회원사 비중1
     */
    shnu_mbcr_rlim1: string;

    /**
     * 매수2 회원사 비중2
     */
    shnu_mbcr_rlim2: string;

    /**
     * 매수2 회원사 비중3
     */
    shnu_mbcr_rlim3: string;

    /**
     * 매수2 회원사 비중4
     */
    shnu_mbcr_rlim4: string;

    /**
     * 매수2 회원사 비중5
     */
    shnu_mbcr_rlim5: string;

    /**
     * 매수2 수량 증감1
     */
    shnu_qty_icdc1: string;

    /**
     * 매수2 수량 증감2
     */
    shnu_qty_icdc2: string;

    /**
     * 매수2 수량 증감3
     */
    shnu_qty_icdc3: string;

    /**
     * 매수2 수량 증감4
     */
    shnu_qty_icdc4: string;

    /**
     * 매수2 수량 증감5
     */
    shnu_qty_icdc5: string;

    /**
     * 외국계 총 매도 수량
     */
    glob_total_seln_qty: string;

    /**
     * 외국계 매도 비중
     */
    glob_seln_rlim: string;

    /**
     * 외국계 순매수 수량
     */
    glob_ntby_qty: string;

    /**
     * 외국계 총 매수2 수량
     */
    glob_total_shnu_qty: string;

    /**
     * 외국계 매수2 비중
     */
    glob_shnu_rlim: string;

    /**
     * 매도 회원사 외국계 여부1
     */
    seln_mbcr_glob_yn_1: string;

    /**
     * 매도 회원사 외국계 여부2
     */
    seln_mbcr_glob_yn_2: string;

    /**
     * 매도 회원사 외국계 여부3
     */
    seln_mbcr_glob_yn_3: string;

    /**
     * 매도 회원사 외국계 여부4
     */
    seln_mbcr_glob_yn_4: string;

    /**
     * 매도 회원사 외국계 여부5
     */
    seln_mbcr_glob_yn_5: string;

    /**
     * 매수2 회원사 외국계 여부1
     */
    shnu_mbcr_glob_yn_1: string;

    /**
     * 매수2 회원사 외국계 여부2
     */
    shnu_mbcr_glob_yn_2: string;

    /**
     * 매수2 회원사 외국계 여부3
     */
    shnu_mbcr_glob_yn_3: string;

    /**
     * 매수2 회원사 외국계 여부4
     */
    shnu_mbcr_glob_yn_4: string;

    /**
     * 매수2 회원사 외국계 여부5
     */
    shnu_mbcr_glob_yn_5: string;

    /**
     * 외국계 총 매도 수량 증감
     */
    glob_total_seln_qty_icdc: string;

    /**
     * 외국계 총 매수2 수량 증감
     */
    glob_total_shnu_qty_icdc: string;
}

export interface DomesticStockQuotationsNewsTitleParam {
    /**
     * 뉴스 제공 업체 코드 공백 필수 입력
     */
    FID_NEWS_OFER_ENTP_CODE: string;

    /**
     * 조건 시장 구분 코드 공백 필수 입력
     */
    FID_COND_MRKT_CLS_CODE: string;

    /**
     * 입력 종목코드 공백: 전체, 종목코드 : 해당코드가 등록된 뉴스
     */
    FID_INPUT_ISCD: string;

    /**
     * 제목 내용 공백 필수 입력
     */
    FID_TITL_CNTT: string;

    /**
     * 입력 날짜 공백: 현재기준, 조회일자(ex 00YYYYMMDD)
     */
    FID_INPUT_DATE_1: string;

    /**
     * 입력 시간 공백: 현재기준, 조회시간(ex 0000HHMMSS)
     */
    FID_INPUT_HOUR_1: string;

    /**
     * 순위 정렬 구분 코드 공백 필수 입력
     */
    FID_RANK_SORT_CLS_CODE: string;

    /**
     * 입력 일련번호 공백 필수 입력
     */
    FID_INPUT_SRNO: string;
}

export interface DomesticStockQuotationsNewsTitleOutput {
    /**
     * 내용 조회용 일련번호
     */
    cntt_usiq_srno: string;

    /**
     * 뉴스 제공 업체 코드
     */
    news_ofer_entp_code: string;

    /**
     * 작성일자
     */
    data_dt: string;

    /**
     * 작성시간
     */
    data_tm: string;

    /**
     * HTS 공시 제목 내용
     */
    hts_pbnt_titl_cntt: string;

    /**
     * 뉴스 대구분
     */
    news_lrdv_code: string;

    /**
     * 자료원
     */
    dorg: string;

    /**
     * 종목 코드1
     */
    iscd1: string;

    /**
     * 종목 코드2
     */
    iscd2: string;

    /**
     * 종목 코드3
     */
    iscd3: string;

    /**
     * 종목 코드4
     */
    iscd4: string;

    /**
     * 종목 코드5
     */
    iscd5: string;
}

export interface DomesticStockQuotationsIntstockMultPriceParam {
    /**
     * 조건 시장 분류 코드1
     * J: KRX
     * NX: NXT
     * UN: 통합
     */
    FID_COND_MRKT_DIV_CODE_1: string;

    /**
     * 입력 종목코드1
     * 그룹별종목조회 결과 jong_code(종목코드)
     */
    FID_INPUT_ISCD_1: string;

    /**
     * 조건 시장 분류 코드2
     */
    FID_COND_MRKT_DIV_CODE_2?: string;

    /**
     * 입력 종목코드2
     */
    FID_INPUT_ISCD_2?: string;

    /**
     * 조건 시장 분류 코드3
     */
    FID_COND_MRKT_DIV_CODE_3?: string;

    /**
     * 입력 종목코드3
     */
    FID_INPUT_ISCD_3?: string;

    /**
     * 조건 시장 분류 코드4
     */
    FID_COND_MRKT_DIV_CODE_4?: string;

    /**
     * 입력 종목코드4
     */
    FID_INPUT_ISCD_4?: string;

    /**
     * 조건 시장 분류 코드5
     */
    FID_COND_MRKT_DIV_CODE_5?: string;

    /**
     * 입력 종목코드5
     */
    FID_INPUT_ISCD_5?: string;

    /**
     * 조건 시장 분류 코드6
     */
    FID_COND_MRKT_DIV_CODE_6?: string;

    /**
     * 입력 종목코드6
     */
    FID_INPUT_ISCD_6?: string;

    /**
     * 조건 시장 분류 코드7
     */
    FID_COND_MRKT_DIV_CODE_7?: string;

    /**
     * 입력 종목코드7
     */
    FID_INPUT_ISCD_7?: string;

    /**
     * 조건 시장 분류 코드8
     */
    FID_COND_MRKT_DIV_CODE_8?: string;

    /**
     * 입력 종목코드8
     */
    FID_INPUT_ISCD_8?: string;

    /**
     * 조건 시장 분류 코드9
     */
    FID_COND_MRKT_DIV_CODE_9?: string;

    /**
     * 입력 종목코드9
     */
    FID_INPUT_ISCD_9?: string;

    /**
     * 조건 시장 분류 코드10
     */
    FID_COND_MRKT_DIV_CODE_10?: string;

    /**
     * 입력 종목코드10
     */
    FID_INPUT_ISCD_10?: string;

    /**
     * 조건 시장 분류 코드11
     */
    FID_COND_MRKT_DIV_CODE_11?: string;

    /**
     * 입력 종목코드11
     */
    FID_INPUT_ISCD_11?: string;

    /**
     * 조건 시장 분류 코드12
     */
    FID_COND_MRKT_DIV_CODE_12?: string;

    /**
     * 입력 종목코드12
     */
    FID_INPUT_ISCD_12?: string;

    /**
     * 조건 시장 분류 코드13
     */
    FID_COND_MRKT_DIV_CODE_13?: string;

    /**
     * 입력 종목코드13
     */
    FID_INPUT_ISCD_13?: string;

    /**
     * 조건 시장 분류 코드14
     */
    FID_COND_MRKT_DIV_CODE_14?: string;

    /**
     * 입력 종목코드14
     */
    FID_INPUT_ISCD_14?: string;

    /**
     * 조건 시장 분류 코드15
     */
    FID_COND_MRKT_DIV_CODE_15?: string;

    /**
     * 입력 종목코드15
     */
    FID_INPUT_ISCD_15?: string;

    /**
     * 조건 시장 분류 코드16
     */
    FID_COND_MRKT_DIV_CODE_16?: string;

    /**
     * 입력 종목코드16
     */
    FID_INPUT_ISCD_16?: string;

    /**
     * 조건 시장 분류 코드17
     */
    FID_COND_MRKT_DIV_CODE_17?: string;

    /**
     * 입력 종목코드17
     */
    FID_INPUT_ISCD_17?: string;

    /**
     * 조건 시장 분류 코드18
     */
    FID_COND_MRKT_DIV_CODE_18?: string;

    /**
     * 입력 종목코드18
     */
    FID_INPUT_ISCD_18?: string;

    /**
     * 조건 시장 분류 코드19
     */
    FID_COND_MRKT_DIV_CODE_19?: string;

    /**
     * 입력 종목코드19
     */
    FID_INPUT_ISCD_19?: string;

    /**
     * 조건 시장 분류 코드20
     */
    FID_COND_MRKT_DIV_CODE_20?: string;

    /**
     * 입력 종목코드20
     */
    FID_INPUT_ISCD_20?: string;

    /**
     * 조건 시장 분류 코드21
     */
    FID_COND_MRKT_DIV_CODE_21?: string;

    /**
     * 입력 종목코드21
     */
    FID_INPUT_ISCD_21?: string;

    /**
     * 조건 시장 분류 코드22
     */
    FID_COND_MRKT_DIV_CODE_22?: string;

    /**
     * 입력 종목코드22
     */
    FID_INPUT_ISCD_22?: string;

    /**
     * 조건 시장 분류 코드23
     */
    FID_COND_MRKT_DIV_CODE_23?: string;

    /**
     * 입력 종목코드23
     */
    FID_INPUT_ISCD_23?: string;

    /**
     * 조건 시장 분류 코드24
     */
    FID_COND_MRKT_DIV_CODE_24?: string;

    /**
     * 입력 종목코드24
     */
    FID_INPUT_ISCD_24?: string;

    /**
     * 조건 시장 분류 코드25
     */
    FID_COND_MRKT_DIV_CODE_25?: string;

    /**
     * 입력 종목코드25
     */
    FID_INPUT_ISCD_25?: string;

    /**
     * 조건 시장 분류 코드26
     */
    FID_COND_MRKT_DIV_CODE_26?: string;

    /**
     * 입력 종목코드26
     */
    FID_INPUT_ISCD_26?: string;

    /**
     * 조건 시장 분류 코드27
     */
    FID_COND_MRKT_DIV_CODE_27?: string;

    /**
     * 입력 종목코드27
     */
    FID_INPUT_ISCD_27?: string;

    /**
     * 조건 시장 분류 코드28
     */
    FID_COND_MRKT_DIV_CODE_28?: string;

    /**
     * 입력 종목코드28
     */
    FID_INPUT_ISCD_28?: string;

    /**
     * 조건 시장 분류 코드29
     */
    FID_COND_MRKT_DIV_CODE_29?: string;

    /**
     * 입력 종목코드29
     */
    FID_INPUT_ISCD_29?: string;

    /**
     * 조건 시장 분류 코드30
     */
    FID_COND_MRKT_DIV_CODE_30?: string;

    /**
     * 입력 종목코드30
     */
    FID_INPUT_ISCD_30?: string;
}

export interface DomesticStockQuotationsIntstockMultPriceOutput {
    /**
     * 코스피 코스닥 구분 명
     */
    kospi_kosdaq_cls_name: string;

    /**
     * 시장 조치 구분 명
     */
    mrkt_trtm_cls_name: string;

    /**
     * 시간 구분 코드
     */
    hour_cls_code: string;

    /**
     * 관심 단축 종목코드
     */
    inter_shrn_iscd: string;

    /**
     * 관심 한글 종목명
     */
    inter_kor_isnm: string;

    /**
     * 관심2 현재가
     */
    inter2_prpr: string;

    /**
     * 관심2 전일 대비
     */
    inter2_prdy_vrss: string;

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
     * 관심2 시가
     */
    inter2_oprc: string;

    /**
     * 관심2 고가
     */
    inter2_hgpr: string;

    /**
     * 관심2 저가
     */
    inter2_lwpr: string;

    /**
     * 관심2 하한가
     */
    inter2_llam: string;

    /**
     * 관심2 상한가
     */
    inter2_mxpr: string;

    /**
     * 관심2 매도호가
     */
    inter2_askp: string;

    /**
     * 관심2 매수호가
     */
    inter2_bidp: string;

    /**
     * 매도 잔량
     */
    seln_rsqn: string;

    /**
     * 매수2 잔량
     */
    shnu_rsqn: string;

    /**
     * 총 매도호가 잔량
     */
    total_askp_rsqn: string;

    /**
     * 총 매수호가 잔량
     */
    total_bidp_rsqn: string;

    /**
     * 누적 거래 대금
     */
    acml_tr_pbmn: string;

    /**
     * 관심2 전일 종가
     */
    inter2_prdy_clpr: string;

    /**
     * 시가 대비 최고가 비율
     */
    oprc_vrss_hgpr_rate: string;

    /**
     * 관심 예상 체결 대비
     */
    intr_antc_cntg_vrss: string;

    /**
     * 관심 예상 체결 대비 부호
     */
    intr_antc_cntg_vrss_sign: string;

    /**
     * 관심 예상 체결 전일 대비율
     */
    intr_antc_cntg_prdy_ctrt: string;

    /**
     * 관심 예상 거래량
     */
    intr_antc_vol: string;

    /**
     * 관심2 기준가
     */
    inter2_sdpr: string;
}

export class DomesticStockQuotationsInquireDailyItemChartPriceParam {
    /**
     * 조건 시장 분류 코드 (J:KRX, NX:NXT, UN:통합)
     */
    FID_COND_MRKT_DIV_CODE: string;

    /**
     * 입력 종목코드 (ex 005930 삼성전자)
     */
    FID_INPUT_ISCD: string;

    /**
     * 입력 날짜 1 (조회 시작일자)
     */
    FID_INPUT_DATE_1: string;

    /**
     * 입력 날짜 2 (조회 종료일자, 최대 100개)
     */
    FID_INPUT_DATE_2: string;

    /**
     * 기간분류코드 (D:일봉 W:주봉, M:월봉, Y:년봉)
     */
    FID_PERIOD_DIV_CODE: string;

    /**
     * 수정주가 원주가 가격 여부 (0:수정주가 1:원주가)
     */
    FID_ORG_ADJ_PRC: string;
}

export interface DomesticStockQuotationsInquireDailyItemChartPriceOutput {
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
     * 주식 전일 종가
     */
    stck_prdy_clpr: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 누적 거래 대금
     */
    acml_tr_pbmn: string;

    /**
     * HTS 한글 종목명
     */
    hts_kor_isnm: string;

    /**
     * 주식 현재가
     */
    stck_prpr: string;

    /**
     * 주식 단축 종목코드
     */
    stck_shrn_iscd: string;

    /**
     * 전일 거래량
     */
    prdy_vol: string;

    /**
     * 주식 상한가
     */
    stck_mxpr: string;

    /**
     * 주식 하한가
     */
    stck_llam: string;

    /**
     * 주식 시가2
     */
    stck_oprc: string;

    /**
     * 주식 최고가
     */
    stck_hgpr: string;

    /**
     * 주식 최저가
     */
    stck_lwpr: string;

    /**
     * 주식 전일 시가
     */
    stck_prdy_oprc: string;

    /**
     * 주식 전일 최고가
     */
    stck_prdy_hgpr: string;

    /**
     * 주식 전일 최저가
     */
    stck_prdy_lwpr: string;

    /**
     * 매도호가
     */
    askp: string;

    /**
     * 매수호가
     */
    bidp: string;

    /**
     * 전일 대비 거래량
     */
    prdy_vrss_vol: string;

    /**
     * 거래량 회전율
     */
    vol_tnrt: string;

    /**
     * 주식 액면가
     */
    stck_fcam: string;

    /**
     * 상장 주수
     */
    lstn_stcn: string;

    /**
     * 자본금
     */
    cpfn: string;

    /**
     * HTS 시가총액
     */
    hts_avls: string;

    /**
     * PER
     */
    per: string;

    /**
     * EPS
     */
    eps: string;

    /**
     * PBR
     */
    pbr: string;

    /**
     * 전체 융자 잔고 비율
     */
    itewhol_loan_rmnd_ratem: string;
}
export interface DomesticStockQuotationsInquireDailyItemChartPriceOutput2 {
    /**
     * 주식 영업 일자
     */
    stck_bsop_date: string;

    /**
     * 주식 종가
     */
    stck_clpr: string;

    /**
     * 주식 시가2
     */
    stck_oprc: string;

    /**
     * 주식 최고가
     */
    stck_hgpr: string;

    /**
     * 주식 최저가
     */
    stck_lwpr: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 누적 거래 대금
     */
    acml_tr_pbmn: string;

    /**
     * 락 구분 코드
     * 01 : 권리락
     * 02 : 배당락
     * 03 : 분배락
     * 04 : 권배락
     * 05 : 중간(분기)배당락
     * 06 : 권리중간배당락
     * 07 : 권리분기배당락
     */
    flng_cls_code: string;

    /**
     * 분할 비율
     * 기준가/전일 종가
     */
    prtt_rate: string;

    /**
     * 변경 여부
     * 현재 영업일에 체결이 발생하지 않아 시가가 없을경우 Y 로 표시(차트에서 사용)
     */
    mod_yn: string;

    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 전일 대비
     */
    prdy_vrss: string;

    /**
     * 재평가사유코드
     * 00:해당없음
     * 01:회사분할
     * 02:자본감소
     * 03:장기간정지
     * 04:초과분배
     * 05:대규모배당
     * 06:회사분할합병
     * 07:ETN증권병합/분할
     * 08:신종증권기세조정
     * 99:기타
     */
    revl_issu_reas: string;
}
