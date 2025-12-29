import { Inject, Injectable } from '@nestjs/common';
import { AppCredentials } from '@modules/korea-investment/common';
import { KoreaInvestmentConfig } from './korea-investment-config.types';

@Injectable()
export class KoreaInvestmentConfigService {
    constructor(
        @Inject('APP_CONFIG') private readonly config: KoreaInvestmentConfig,
    ) {}

    /**
     * 한국투자증권 사용자 아이디를 가져옵니다.
     */
    public getUserId() {
        return this.config.user.id;
    }

    /**
     * 한국투자증권 앱 인증 정보를 가져옵니다.
     */
    public getCredentials(): AppCredentials {
        return {
            appkey: this.config.api.key,
            appsecret: this.config.api.secret,
        };
    }

    /**
     * 한국투자증권 Rest API의 Host를 가져옵니다.
     */
    public getHost() {
        return this.config.api.host;
    }

    /**
     * 한국투자증권 웹 소켓 API의 Host를 가져옵니다.
     */
    public getWebSocketHost() {
        return this.config.webSocket.host;
    }
}
