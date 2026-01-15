export enum MarketDivCode {
    KRX = 'J',
    NXT = 'NX',
    통합 = 'UN',
}

export enum ProductType {
    주식 = '300',
    선물옵션 = '301',
    채권 = '302',
    ELS = '306',
}

export enum CustomerType {
    Corporation = 'B',
    Personal = 'P',
}

export enum PeriodType {
    일봉 = 'D',
    주봉 = 'W',
    월봉 = 'M',
    년봉 = 'Y',
}

export interface AppCredential {
    /**
     * 앱키
     * 한국투자증권 홈페이지에서 발급받은 appkey (절대 노출되지 않도록 주의해주세요.)
     */
    appkey: string;

    /**
     * 앱시크릿키
     * 한국투자증권 홈페이지에서 발급받은 appkey (절대 노출되지 않도록 주의해주세요.)
     */
    appsecret: string;
}

export interface KoreaInvestmentBaseHeader extends AppCredential {
    [key: string]: string | undefined;

    /**
     * 컨텐츠타입
     * application/json; charset=utf-8
     */
    'content-type': 'application/json; charset=utf-8';

    /**
     * 접근토큰
     * OAuth 토큰이 필요한 API 경우 발급한 Access token일반고객
     * (Access token 유효기간 1일, OAuth 2.0의 Client Credentials Grant 절차를 준용)
     * 법인(Access token 유효기간 3개월, Refresh token 유효기간 1년, OAuth 2.0의 Authorization Code Grant 절차를 준용)
     */
    authorization: string;

    /**
     * 고객식별키
     * [법인 필수] 제휴사 회원 관리를 위한 고객식별키
     */
    personalseckey?: string;

    /**
     * 거래ID
     * FHKST01010100
     */
    tr_id: string;

    /**
     * 연속 거래 여부
     * tr_cont를 이용한 다음조회 불가 API
     */
    tr_cont?: string;

    /**
     * 고객 타입
     * B : 법인
     * P : 개인
     */
    custtype: CustomerType;

    /**
     * 일련번호
     * [법인 필수] 001
     */
    seq_no?: string;

    /**
     * 맥주소
     * 법인고객 혹은 개인고객의 Mac address 값
     */
    mac_address?: string;

    /**
     * 핸드폰번호
     * [법인 필수] 제휴사APP을 사용하는 경우 사용자(회원)
     * 핸드폰번호ex) 01011112222 (하이픈 등 구분값 제거)
     */
    phone_number?: string;

    /**
     * 접속 단말 공인 IP
     * [법인 필수] 사용자(회원)의 IP Address
     */
    ip_addr?: string;

    /**
     * Global UID
     * [법인 전용] 거래고유번호로 사용하므로 거래별로 UNIQUE해야 함
     */
    gt_uid?: string;
}

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
