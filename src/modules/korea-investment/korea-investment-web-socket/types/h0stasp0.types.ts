export interface H0stasp0Data {
    /**
     * 유가증권 단축 종목코드
     */
    mkscShrnIscd: string;

    /**
     * 영업 시간
     */
    bsopHour: string;

    /**
     * 시간 구분 코드
     * 0 : 장중
     * A : 장후예상
     * B : 장전예상
     * C : 9시이후의 예상가, VI발동
     * D : 시간외 단일가 예상
     */
    hourClsCode: string;

    /**
     * 매도호가1
     */
    askp1: string; // number;

    /**
     * 매도호가2
     */
    askp2: string; // number;

    /**
     * 매도호가3
     */
    askp3: string; // number;

    /**
     * 매도호가4
     */
    askp4: string; // number;

    /**
     * 매도호가5
     */
    askp5: string; // number;

    /**
     * 매도호가6
     */
    askp6: string; // number;

    /**
     * 매도호가7
     */
    askp7: string; // number;

    /**
     * 매도호가8
     */
    askp8: string; // number;

    /**
     * 매도호가9
     */
    askp9: string; // number;

    /**
     * 매도호가10
     */
    askp10: string; // number;

    /**
     * 매수호가1
     */
    bidp1: string; // number;

    /**
     * 매수호가2
     */
    bidp2: string; // number;

    /**
     * 매수호가3
     */
    bidp3: string; // number;

    /**
     * 매수호가4
     */
    bidp4: string; // number;

    /**
     * 매수호가5
     */
    bidp5: string; // number;

    /**
     * 매수호가6
     */
    bidp6: string; // number;

    /**
     * 매수호가7
     */
    bidp7: string; // number;

    /**
     * 매수호가8
     */
    bidp8: string; // number;

    /**
     * 매수호가9
     */
    bidp9: string; // number;

    /**
     * 매수호가10
     */
    bidp10: string; // number;

    /**
     * 매도호가 잔량1
     */
    askpRsqn1: string; // number;

    /**
     * 매도호가 잔량2
     */
    askpRsqn2: string; // number;

    /**
     * 매도호가 잔량3
     */
    askpRsqn3: string; // number;

    /**
     * 매도호가 잔량4
     */
    askpRsqn4: string; // number;

    /**
     * 매도호가 잔량5
     */
    askpRsqn5: string; // number;

    /**
     * 매도호가 잔량6
     */
    askpRsqn6: string; // number;

    /**
     * 매도호가 잔량7
     */
    askpRsqn7: string; // number;

    /**
     * 매도호가 잔량8
     */
    askpRsqn8: string; // number;

    /**
     * 매도호가 잔량9
     */
    askpRsqn9: string; // number;

    /**
     * 매도호가 잔량10
     */
    askpRsqn10: string; // number;

    /**
     * 매수호가 잔량1
     */
    bidpRsqn1: string; // number;

    /**
     * 매수호가 잔량2
     */
    bidpRsqn2: string; // number;

    /**
     * 매수호가 잔량3
     */
    bidpRsqn3: string; // number;

    /**
     * 매수호가 잔량4
     */
    bidpRsqn4: string; // number;

    /**
     * 매수호가 잔량5
     */
    bidpRsqn5: string; // number;

    /**
     * 매수호가 잔량6
     */
    bidpRsqn6: string; // number;

    /**
     * 매수호가 잔량7
     */
    bidpRsqn7: string; // number;

    /**
     * 매수호가 잔량8
     */
    bidpRsqn8: string; // number;

    /**
     * 매수호가 잔량9
     */
    bidpRsqn9: string; // number;

    /**
     * 매수호가 잔량10
     */
    bidpRsqn10: string; // number;

    /**
     * 총 매도호가 잔량
     */
    totalAskpRsqn: string; // number;

    /**
     * 총 매수호가 잔량
     */
    totalBidpRsqn: string; // number;

    /**
     * 시간외 총 매도호가 잔량
     */
    ovtmTotalAskpRsqn: string; // number;

    /**
     * 시간외 총 매수호가 잔량
     */
    ovtmTotalBidpRsqn: string; // number;

    /**
     * 예상 체결가
     * 동시호가 등 특정 조건하에서만 발생
     */
    antcCnpr: string; // number;

    /**
     * 예상 체결량
     * 동시호가 등 특정 조건하에서만 발생
     */
    antcCnqn: string; // number;

    /**
     * 예상 거래량
     * 동시호가 등 특정 조건하에서만 발생
     */
    antcVol: string; // number;

    /**
     * 예상 체결 대비
     * 동시호가 등 특정 조건하에서만 발생
     */
    antcCntgVrss: string; // number;

    /**
     * 예상 체결 대비 부호
     * 동시호가 등 특정 조건하에서만 발생1 : 상한2 : 상승3 : 보합4 : 하한5 : 하락
     */
    antcCntgVrssSign: string;

    /**
     * 예상 체결 전일 대비율
     */
    antcCntgPrdyCtrt: string; // number;

    /**
     * 누적 거래량
     */
    acmlVol: string; // number;

    /**
     * 총 매도호가 잔량 증감
     */
    totalAskpRsqnIcdc: string; // number;

    /**
     * 총 매수호가 잔량 증감
     */
    totalBidpRsqnIcdc: string; // number;

    /**
     * 시간외 총 매도호가 증감
     */
    ovtmTotalAskpIcdc: string; // number;

    /**
     * 시간외 총 매수호가 증감
     */
    ovtmTotalBidpIcdc: string; // number;

    /**
     * 주식 매매 구분 코드
     * 사용 X (삭제된 값)
     */
    stckDealClsCode: string;
}
