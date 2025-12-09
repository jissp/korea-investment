export interface H0nxcnt0Data {
    /**
     * 유가증권 단축 종목코드
     */
    mkscShrnIscd: string;

    /**
     * 주식 체결 시간
     */
    stckCntgHour: string;

    /**
     * 주식 현재가
     */
    stckPrpr: string;

    /**
     * 전일 대비 부호
     */
    prdyVrssSign: string;

    /**
     * 전일 대비
     */
    prdyVrss: string;

    /**
     * 전일 대비율
     */
    prdyCtrt: string;

    /**
     * 가중 평균 주식 가격
     */
    wghnAvrgStckPrc: string;

    /**
     * 주식 시가
     */
    stckOprc: string;

    /**
     * 주식 최고가
     */
    stckHgpr: string;

    /**
     * 주식 최저가
     */
    stckLwpr: string;

    /**
     * 매도호가1
     */
    askp1: string;

    /**
     * 매수호가1
     */
    bidp1: string;

    /**
     * 체결 거래량
     */
    cntgVol: string;

    /**
     * 누적 거래량
     */
    acmlVol: string;

    /**
     * 누적 거래 대금
     */
    acmlTrPbmn: string;

    /**
     * 매도 체결 건수
     */
    selnCntgCsnu: string;

    /**
     * 매수 체결 건수
     */
    shnuCntgCsnu: string;

    /**
     * 순매수 체결 건수
     */
    ntbyCntgCsnu: string;

    /**
     * 체결강도
     */
    cttr: string;

    /**
     * 총 매도 수량
     */
    selnCntgSmtn: string;

    /**
     * 총 매수 수량
     */
    shnuCntgSmtn: string;

    /**
     * 체결구분
     */
    cntgClsCode: string;

    /**
     * 매수비율
     */
    shnuRate: string;

    /**
     * 전일 거래량 대비 등락율
     */
    prdyVolVrssAcmlVolRate: string;

    /**
     * 시가 시간
     */
    oprcHour: string;

    /**
     * 시가대비구분
     */
    oprcVrssPrprSign: string;

    /**
     * 시가대비
     */
    oprcVrssPrpr: string;

    /**
     * 최고가 시간
     */
    hgprHour: string;

    /**
     * 고가대비구분
     */
    hgprVrssPrprSign: string;

    /**
     * 고가대비
     */
    hgprVrssPrpr: string;

    /**
     * 최저가 시간
     */
    lwprHour: string;

    /**
     * 저가대비구분
     */
    lwprVrssPrprSign: string;

    /**
     * 저가대비
     */
    lwprVrssPrpr: string;

    /**
     * 영업 일자
     */
    bsopDate: string;

    /**
     * 신 장운영 구분 코드
     */
    newMkopClsCode: string;

    /**
     * 거래정지 여부
     */
    trhtYn: string;

    /**
     * 매도호가 잔량1
     */
    askpRsqn1: string;

    /**
     * 매수호가 잔량1
     */
    bidpRsqn1: string;

    /**
     * 총 매도호가 잔량
     */
    totalAskpRsqn: string;

    /**
     * 총 매수호가 잔량
     */
    totalBidpRsqn: string;

    /**
     * 거래량 회전율
     */
    volTnrt: string;

    /**
     * 전일 동시간 누적 거래량
     */
    prdySmnsHourAcmlVol: string;

    /**
     * 전일 동시간 누적 거래량 비율
     */
    prdySmnsHourAcmlVolRate: string;

    /**
     * 시간 구분 코드
     */
    hourClsCode: string;

    /**
     * 임의종료구분코드
     */
    mrktTrtmClsCode: string;

    /**
     * 정적VI발동기준가
     */
    viStndPrc: string;
}
