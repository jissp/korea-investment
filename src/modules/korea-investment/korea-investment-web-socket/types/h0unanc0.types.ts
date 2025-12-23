export interface H0unanc0Data {
    /**
     * 유가증권단축종목코드
     */
    MKSC_SHRN_ISCD: string;

    /**
     * 주식체결시간
     */
    STCK_CNTG_HOUR: string;

    /**
     * 주식현재가
     */
    STCK_PRPR: string;

    /**
     * 전일대비구분
     */
    PRDY_VRSS_SIGN: string;

    /**
     * 전일대비
     */
    PRDY_VRSS: string;

    /**
     * 등락율
     */
    PRDY_CTRT: string;

    /**
     * 가중평균주식가격
     */
    WGHN_AVRG_STCK_PRC: string;

    /**
     * 시가
     */
    STCK_OPRC: string;

    /**
     * 고가
     */
    STCK_HGPR: string;

    /**
     * 저가
     */
    STCK_LWPR: string;

    /**
     * 매도호가
     */
    ASKP1: string;

    /**
     * 매수호가
     */
    BIDP1: string;

    /**
     * 거래량
     */
    CNTG_VOL: string;

    /**
     * 누적거래량
     */
    ACML_VOL: string;

    /**
     * 누적거래대금
     */
    ACML_TR_PBMN: string;

    /**
     * 매도체결건수
     */
    SELN_CNTG_CSNU: string;

    /**
     * 매수체결건수
     */
    SHNU_CNTG_CSNU: string;

    /**
     * 순매수체결건수
     */
    NTBY_CNTG_CSNU: string;

    /**
     * 체결강도
     */
    CTTR: string;

    /**
     * 총매도수량
     */
    SELN_CNTG_SMTN: string;

    /**
     * 총매수수량
     */
    SHNU_CNTG_SMTN: string;

    /**
     * 체결구분
     */
    CNTG_CLS_CODE: string;

    /**
     * 매수비율
     */
    SHNU_RATE: string;

    /**
     * 전일거래량대비등락율
     */
    PRDY_VOL_VRSS_ACML_VOL_RATE: string;

    /**
     * 시가시간
     */
    OPRC_HOUR: string;

    /**
     * 시가대비구분
     */
    OPRC_VRSS_PRPR_SIGN: string;

    /**
     * 시가대비
     */
    OPRC_VRSS_PRPR: string;

    /**
     * 최고가시간
     */
    HGPR_HOUR: string;

    /**
     * 고가대비구분
     */
    HGPR_VRSS_PRPR_SIGN: string;

    /**
     * 고가대비
     */
    HGPR_VRSS_PRPR: string;

    /**
     * 최저가시간
     */
    LWPR_HOUR: string;

    /**
     * 저가대비구분
     */
    LWPR_VRSS_PRPR_SIGN: string;

    /**
     * 저가대비
     */
    LWPR_VRSS_PRPR: string;

    /**
     * 영업일자
     */
    BSOP_DATE: string;

    /**
     * 신장운영구분코드
     */
    NEW_MKOP_CLS_CODE: string;

    /**
     * 거래정지여부
     */
    TRHT_YN: string;

    /**
     * 매도호가잔량1
     */
    ASKP_RSQN1: string;

    /**
     * 매수호가잔량1
     */
    BIDP_RSQN1: string;

    /**
     * 총매도호가잔량
     */
    TOTAL_ASKP_RSQN: string;

    /**
     * 총매수호가잔량
     */
    TOTAL_BIDP_RSQN: string;

    /**
     * 거래량회전율
     */
    VOL_TNRT: string;

    /**
     * 전일동시간누적거래량
     */
    PRDY_SMNS_HOUR_ACML_VOL: string;

    /**
     * 전일동시간누적거래량비율
     */
    PRDY_SMNS_HOUR_ACML_VOL_RATE: string;

    /**
     * 시간구분코드
     */
    HOUR_CLS_CODE: string;

    /**
     * 임의종료구분코드
     */
    MRKT_TRTM_CLS_CODE: string;

    /**
     * VI 상태값
     */
    VI_STND_PRC: string;
}
