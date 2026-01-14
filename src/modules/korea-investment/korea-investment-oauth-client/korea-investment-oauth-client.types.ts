import { AppCredential } from '@modules/korea-investment/common';

export enum KoreaInvestmentOauthClientProvider {
    Client = 'Client',
}

export interface RequestBodyOauth2TokenP extends AppCredential {
    grant_type: string;
}

export interface ResponseOauth2TokenP {
    /** OAuth 토큰이 필요한 API 경우 발급한 Access token
     * - 일반개인고객/일반법인고객: 유효기간 1일 (6시간 이내 재호출 시 직전 토큰값 리턴)
     * - 제휴법인: 유효기간 3개월
     * @example "eyJ0eXUxMiJ9.eyJz…..................................."
     */
    access_token: string;

    /** 접근토큰유형 (API 호출 시 "Bearer eyJ...." 형태로 사용)
     * @example "Bearer"
     */
    token_type: string;

    /** 유효기간(초)
     * @example 7776000
     */
    expires_in: number;

    /** 유효기간(년:월:일 시:분:초)
     * @example "2022-08-30 08:10:10"
     */
    access_token_token_expired: string;
}

export interface RequestBodyOauth2RevokeTokenP extends AppCredential {
    token: string;
}

export interface ResponseOauth2RevokeTokenP {
    /**
     * HTTP 응답코드
     */
    code?: string;
    /**
     * 응답메세지
     */
    message?: string;
}

export type Oauth2WebSocketTokenRequestBody = Pick<AppCredential, 'appkey'> & {
    /**
     * 권한부여타입
     */
    grant_type: string;

    /**
     * 한국투자증권 홈페이지에서 발급받은 appsecret (절대 노출되지 않도록 주의해주세요.)
     * 주의 : appsecret와 secretkey는 동일하오니 착오없으시기 바랍니다. (용어가 다른점 양해 부탁드립니다.)
     */
    secretkey: string;
};

export interface Oauth2WebsocketTokenResponse {
    /**
     * 웹소켓 이용 시 발급받은 웹소켓 접속키를 appkey와 appsecret 대신 헤더에 넣어 API 호출합니다.
     */
    approval_key: string;
}
