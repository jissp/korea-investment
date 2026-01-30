export interface ForeignInstitutionTotalParam {
    /**
     * 시장 분류 코드
     * (V: Default)
     */
    FID_COND_MRKT_DIV_CODE: string;

    /**
     * 조건 화면 분류 코드
     * (16449: Default)
     */
    FID_COND_SCR_DIV_CODE: string;

    /**
     * 입력 종목코드
     * (0000:전체, 0001:코스피, 1001:코스닥 등)
     */
    FID_INPUT_ISCD: string;

    /**
     * 분류 구분 코드
     * (0: 수량정열, 1: 금액정열)
     */
    FID_DIV_CLS_CODE: string;

    /**
     * 순위 정렬 구분 코드
     * (0: 순매수상위, 1: 순매도상위)
     */
    FID_RANK_SORT_CLS_CODE: string;

    /**
     * 기타 구분 정렬
     * (0:전체 1:외국인 2:기관계 3:기타)
     */
    FID_ETC_CLS_CODE: string;
}

export class ForeignInstitutionTotalOutput {
    /**
     * HTS 한글 종목명
     */
    hts_kor_isnm: string;

    /**
     * 유가증권 단축 종목코드
     */
    mksc_shrn_iscd: string;

    /**
     * 순매수 수량
     */
    ntby_qty: string;

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
     * 외국인 순매수 수량
     */
    frgn_ntby_qty: string;

    /**
     * 기관계 순매수 수량
     */
    orgn_ntby_qty: string;

    /**
     * 투자신탁 순매수 수량
     */
    ivtr_ntby_qty: string;

    /**
     * 은행 순매수 수량
     */
    bank_ntby_qty: string;

    /**
     * 보험 순매수 수량
     */
    insu_ntby_qty: string;

    /**
     * 종금 순매수 수량
     */
    mrbn_ntby_qty: string;

    /**
     * 기금 순매수 수량
     */
    fund_ntby_qty: string;

    /**
     * 기타 단체 순매수 거래량
     */
    etc_orgt_ntby_vol: string;

    /**
     * 기타 법인 순매수 거래량
     */
    etc_corp_ntby_vol: string;

    /**
     * 외국인 순매수 거래 대금
     * (단위 : 백만원, 수량*현재가)
     */
    frgn_ntby_tr_pbmn: string;

    /**
     * 기관계 순매수 거래 대금
     */
    orgn_ntby_tr_pbmn: string;

    /**
     * 투자신탁 순매수 거래 대금
     */
    ivtr_ntby_tr_pbmn: string;

    /**
     * 은행 순매수 거래 대금
     */
    bank_ntby_tr_pbmn: string;

    /**
     * 보험 순매수 거래 대금
     */
    insu_ntby_tr_pbmn: string;

    /**
     * 종금 순매수 거래 대금
     */
    mrbn_ntby_tr_pbmn: string;

    /**
     * 기금 순매수 거래 대금
     */
    fund_ntby_tr_pbmn: string;

    /**
     * 기타 단체 순매수 거래 대금
     */
    etc_orgt_ntby_tr_pbmn: string;

    /**
     * 기타 법인 순매수 거래 대금
     */
    etc_corp_ntby_tr_pbmn: string;
}
