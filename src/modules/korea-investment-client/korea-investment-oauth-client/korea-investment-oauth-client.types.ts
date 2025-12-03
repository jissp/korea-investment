import { AppCredentials } from '../common/base.types';

export interface RequestBodyOauth2TokenP extends AppCredentials {
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

export interface RequestBodyOauth2RevokeTokenP extends AppCredentials {
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
