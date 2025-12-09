export interface H0stcnt0Data {
    /**
     * 	유가증권 단축 종목코드
     */
    mkscShrnIscd: string;

    /**
     * 	주식 체결 시간
     */
    stckCntgHour: string;

    /**
     * 	주식 현재가	체결가격
     */
    stckPrpr: string; // number;

    /**
     * 	전일 대비 부호
     * 	1 : 상한
     * 	2 : 상승
     * 	3 : 보합
     * 	4 : 하한
     * 	5 : 하락
     */
    prdyVrssSign: string;

    /**
     * 	전일 대비
     */
    prdyVrss: string; // number;

    /**
     * 	전일 대비율
     */
    prdyCtrt: string; // number;

    /**
     * 	가중 평균 주식 가격
     */
    wghnAvrgStckPrc: string; // number;

    /**
     * 	주식 시가
     */
    stckOprc: string; // number;

    /**
     * 	주식 최고가
     */
    stckHgpr: string; // number;

    /**
     * 	주식 최저가
     */
    stckLwpr: string; // number;

    /**
     * 	매도호가1
     */
    askp1: string; // number;

    /**
     * 	매수호가1
     */
    bidp1: string; // number;

    /**
     * 	체결 거래량
     */
    cntgVol: string; // number;

    /**
     * 	누적 거래량
     */
    acmlVol: string; // number;

    /**
     * 	누적 거래 대금
     */
    acmlTrPbmn: string; // number;

    /**
     * 	매도 체결 건수
     */
    selnCntgCsnu: string; // number;

    /**
     * 	매수 체결 건수
     */
    shnuCntgCsnu: string; // number;

    /**
     * 	순매수 체결 건수
     */
    ntbyCntgCsnu: string; // number;

    /**
     * 	체결강도
     */
    cttr: string; // number;

    /**
     * 	총 매도 수량
     */
    selnCntgSmtn: string; // number;

    /**
     * 	총 매수 수량
     */
    shnuCntgSmtn: string; // number;

    /**
     * 	체결구분	1:매수(+)3:장전5:매도(-)
     */
    ccldDvsn: string;

    /**
     * 	매수비율
     */
    shnuRate: string; // number;

    /**
     * 	전일 거래량 대비 등락율
     */
    prdyVolVrssAcmlVolRate: string; // number;

    /**
     * 	시가 시간
     */
    oprcHour: string;

    /**
     * 	시가대비구분
     * 	1 : 상한
     * 	2 : 상승
     * 	3 : 보합
     * 	4 : 하한
     * 	5 : 하락
     */
    oprcVrssPrprSign: string;

    /**
     * 	시가대비
     */
    oprcVrssPrpr: string; // number;

    /**
     * 	최고가 시간
     */
    hgprHour: string;

    /**
     * 	고가대비구분
     * 	1 : 상한
     * 	2 : 상승
     * 	3 : 보합
     * 	4 : 하한
     * 	5 : 하락
     */
    hgprVrssPrprSign: string;

    /**
     * 	고가대비
     */
    hgprVrssPrpr: string; // number;

    /**
     * 	최저가 시간
     */
    lwprHour: string;

    /**
     * 	저가대비구분
     * 	1 : 상한
     * 	2 : 상승
     * 	3 : 보합
     * 	4 : 하한
     * 	5 : 하락
     */
    lwprVrssPrprSign: string;

    /**
     * 	저가대비
     */
    lwprVrssPrpr: string; // number;

    /**
     * 	영업 일자
     */
    bsopDate: string;

    /**
     * 	신 장운영 구분 코드	(1) 첫 번째 비트1 : 장개시전2 : 장중3 : 장종료후4 : 시간외단일가7 : 일반Buy-in 8 : 당일Buy-in (2) 두 번째 비트0 : 보통1 : 종가2 : 대량3 : 바스켓7 : 정리매매8 : Buy-in
     */
    newMkopClsCode: string;

    /**
     * 	거래정지 여부	Y : 정지N : 정상거래
     */
    trhtYn: string;

    /**
     * 	매도호가 잔량1
     */
    askpRsqn1: string; // number;

    /**
     * 	매수호가 잔량1
     */
    bidpRsqn1: string; // number;

    /**
     * 	총 매도호가 잔량
     */
    totalAskpRsqn: string; // number;

    /**
     * 	총 매수호가 잔량
     */
    totalBidpRsqn: string; // number;

    /**
     * 	거래량 회전율
     */
    volTnrt: string; // number;

    /**
     * 	전일 동시간 누적 거래량
     */
    prdySmnsHourAcmlVol: string; // number;

    /**
     * 	전일 동시간 누적 거래량 비율
     */
    prdySmnsHourAcmlVolRate: string; // number;

    /**
     * 	시간 구분 코드	0 : 장중A : 장후예상B : 장전예상C : 9시이후의 예상가, VI발동D : 시간외 단일가 예상
     */
    hourClsCode: string;

    /**
     * 	임의종료구분코드
     */
    mrktTrtmClsCode: string;

    /**
     * 	정적VI발동기준가
     */
    viStndPrc: string; // number;
}
