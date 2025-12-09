export interface BaseResponse<R> {
    /**
     * 	성공 실패여부
     */
    rt_cd: string;

    /**
     * 	응답코드
     */
    msg_cd: string;

    /**
     * 	응답메세지
     */
    msg1: string;

    /**
     * 응답상세
     */
    output: R;
}

export interface BaseMultiResponse<R, R2 = null> {
    /**
     * 	성공 실패여부
     */
    rt_cd: string;

    /**
     * 	응답코드
     */
    msg_cd: string;

    /**
     * 	응답메세지
     */
    msg1: string;

    /**
     * 응답상세
     */
    output1: R;

    /**
     * 응답상세
     */
    output2: R2;
}

export interface DomesticStockQuotationInquirePriceOutput {
    /**
     * 종목 상태 구분 코드
     */
    iscd_stat_cls_code: string;

    /**
     * 증거금 비율
     */
    marg_rate: string;

    /**
     * 대표 시장 한글 명
     */
    rprs_mrkt_kor_name: string;

    /**
     * 신 고가 저가 구분 코드
     */
    new_hgpr_lwpr_cls_code: string;

    /**
     * 업종 한글 종목명
     */
    bstp_kor_isnm: string;

    /**
     * 임시 정지 여부
     */
    temp_stop_yn: string;

    /**
     * 시가 범위 연장 여부
     */
    oprc_rang_cont_yn: string;

    /**
     * 종가 범위 연장 여부
     */
    clpr_rang_cont_yn: string;

    /**
     * 신용 가능 여부
     */
    crdt_able_yn: string;

    /**
     * 보증금 비율 구분 코드
     */
    grmn_rate_cls_code: string;

    /**
     * ELW 발행 여부
     */
    elw_pblc_yn: string;

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
     * 주식 상한가
     */
    stck_mxpr: string;

    /**
     * 주식 하한가
     */
    stck_llam: string;

    /**
     * 주식 기준가
     */
    stck_sdpr: string;

    /**
     * 가중 평균 주식 가격
     */
    wghn_avrg_stck_prc: string;

    /**
     * HTS 외국인 소진율
     */
    hts_frgn_ehrt: string;

    /**
     * 외국인 순매수 수량
     */
    frgn_ntby_qty: string;

    /**
     * 프로그램매매 순매수 수량
     */
    pgtr_ntby_qty: string;

    /**
     * 피벗 2차 디저항 가격
     */
    pvt_scnd_dmrs_prc: string;

    /**
     * 피벗 1차 디저항 가격
     */
    pvt_frst_dmrs_prc: string;

    /**
     * 피벗 포인트 값
     */
    pvt_pont_val: string;

    /**
     * 피벗 1차 디지지 가격
     */
    pvt_frst_dmsp_prc: string;

    /**
     * 피벗 2차 디지지 가격
     */
    pvt_scnd_dmsp_prc: string;

    /**
     * 디저항 값
     */
    dmrs_val: string;

    /**
     * 디지지 값
     */
    dmsp_val: string;

    /**
     * 자본금
     */
    cpfn: string;

    /**
     * 제한 폭 가격
     */
    rstc_wdth_prc: string;

    /**
     * 주식 액면가
     */
    stck_fcam: string;

    /**
     * 주식 대용가
     */
    stck_sspr: string;

    /**
     * 호가단위
     */
    aspr_unit: string;

    /**
     * HTS 매매 수량 단위 값
     */
    hts_deal_qty_unit_val: string;

    /**
     * 상장 주수
     */
    lstn_stcn: string;

    /**
     * HTS 시가총액
     */
    hts_avls: string;

    /**
     * PER
     */
    per: string;

    /**
     * PBR
     */
    pbr: string;

    /**
     * 결산 월
     */
    stac_month: string;

    /**
     * 거래량 회전율
     */
    vol_tnrt: string;

    /**
     * EPS
     */
    eps: string;

    /**
     * BPS
     */
    bps: string;

    /**
     * 250일 최고가
     */
    d250_hgpr: string;

    /**
     * 250일 최고가 일자
     */
    d250_hgpr_date: string;

    /**
     * 250일 최고가 대비 현재가 비율
     */
    d250_hgpr_vrss_prpr_rate: string;

    /**
     * 250일 최저가
     */
    d250_lwpr: string;

    /**
     * 250일 최저가 일자
     */
    d250_lwpr_date: string;

    /**
     * 250일 최저가 대비 현재가 비율
     */
    d250_lwpr_vrss_prpr_rate: string;

    /**
     * 주식 연중 최고가
     */
    stck_dryy_hgpr: string;

    /**
     * 연중 최고가 대비 현재가 비율
     */
    dryy_hgpr_vrss_prpr_rate: string;

    /**
     * 연중 최고가 일자
     */
    dryy_hgpr_date: string;

    /**
     * 주식 연중 최저가
     */
    stck_dryy_lwpr: string;

    /**
     * 연중 최저가 대비 현재가 비율
     */
    dryy_lwpr_vrss_prpr_rate: string;

    /**
     * 연중 최저가 일자
     */
    dryy_lwpr_date: string;

    /**
     * 52주일 최고가
     */
    w52_hgpr: string;

    /**
     * 52주일 최고가 대비 현재가 대비
     */
    w52_hgpr_vrss_prpr_ctrt: string;

    /**
     * 52주일 최고가 일자
     */
    w52_hgpr_date: string;

    /**
     * 52주일 최저가
     */
    w52_lwpr: string;

    /**
     * 52주일 최저가 대비 현재가 대비
     */
    w52_lwpr_vrss_prpr_ctrt: string;

    /**
     * 52주일 최저가 일자
     */
    w52_lwpr_date: string;

    /**
     * 전체 융자 잔고 비율
     */
    whol_loan_rmnd_rate: string;

    /**
     * 공매도가능여부
     */
    ssts_yn: string;

    /**
     * 주식 단축 종목코드
     */
    stck_shrn_iscd: string;

    /**
     * 액면가 통화명
     */
    fcam_cnnm: string;

    /**
     * 자본금 통화명
     */
    cpfn_cnnm: string;

    /**
     * 접근도
     */
    apprch_rate: string;

    /**
     * 외국인 보유 수량
     */
    frgn_hldn_qty: string;

    /**
     * VI적용구분코드
     */
    vi_cls_code: string;

    /**
     * 시간외단일가VI적용구분코드
     */
    ovtm_vi_cls_code: string;

    /**
     * 최종 공매도 체결 수량
     */
    last_ssts_cntg_qty: string;

    /**
     * 투자유의여부
     */
    invt_caful_yn: string;

    /**
     * 시장경고코드
     */
    mrkt_warn_cls_code: string;

    /**
     * 단기과열여부
     */
    short_over_yn: string;

    /**
     * 정리매매여부
     */
    sltr_yn: string;

    /**
     * 관리종목여부
     */
    mang_issu_cls_code: string;
}

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

export interface DomesticStockQuotationsInquireIndexTimePrice {
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
