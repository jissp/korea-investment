export interface H0unpgm0Data {
    /**
     * 유가증권 단축 종목코드
     */
    MKSC_SHRN_ISCD: string;

    /**
     * 주식 체결 시간
     */
    STCK_CNTG_HOUR: string;

    /**
     * 매도 체결량
     */
    SELN_CNQN: string;

    /**
     * 매도 거래 대금
     */
    SELN_TR_PBMN: string;

    /**
     * 매수2 체결량
     */
    SHNU_CNQN: string;

    /**
     * 매수2 거래 대금
     */
    SHNU_TR_PBMN: string;

    /**
     * 순매수 체결량
     */
    NTBY_CNQN: string;

    /**
     * 순매수 거래 대금
     */
    NTBY_TR_PBMN: string;

    /**
     * 매도호가잔량
     */
    SELN_RSQN: string;

    /**
     * 매수호가잔량
     */
    SHNU_RSQN: string;

    /**
     * 전체순매수호가잔량
     */
    WHOL_NTBY_QTY: string;
}
