export interface DomesticHolidayInquiryParam {
    /**
     * 기준일자
     * (YYYYMMDD)
     */
    BASS_DT: string;

    /**
     * 연속조회키
     * (공백으로 입력)
     */
    CTX_AREA_NK: string;

    /**
     * 연속조회검색조건
     * (공백으로 입력)
     */
    CTX_AREA_FK: string;
}

export class DomesticHolidayInquiryOutput {
    /**
     * 기준일자
     * (YYYYMMDD)
     */
    bass_dt: string;

    /**
     * 요일구분코드
     * (01:일요일, 02:월요일, 03:화요일, 04:수요일, 05:목요일, 06:금요일, 07:토요일)
     */
    wday_dvsn_cd: string;

    /**
     * 영업일여부
     * (Y/N, 금융기관이 업무를 하는 날)
     */
    bzdy_yn: string;

    /**
     * 거래일여부
     * (Y/N, 증권 업무가 가능한 날)
     */
    tr_day_yn: string;

    /**
     * 개장일여부
     * (Y/N, 주식시장이 개장되는 날 - 주문 가능 여부 확인용)
     */
    opnd_yn: string;

    /**
     * 결제일여부
     * (Y/N, 주식 거래에서 실제로 주식을 인수하고 돈을 지불하는 날)
     */
    sttl_day_yn: string;
}
