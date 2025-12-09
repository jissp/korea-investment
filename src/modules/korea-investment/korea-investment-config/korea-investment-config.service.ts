import { Inject, Injectable } from '@nestjs/common';
import { AppCredentials } from '@modules/korea-investment/common';
import { KoreaInvestmentConfig } from './korea-investment-config.types';

@Injectable()
export class KoreaInvestmentConfigService {
    constructor(
        @Inject('APP_CONFIG') private readonly config: KoreaInvestmentConfig,
    ) {}

    public getCredentials(): AppCredentials {
        return {
            appkey: this.config.api.key,
            appsecret: this.config.api.secret,
        };
    }

    public getHost() {
        return this.config.api.host;
    }

    public getWebSocketHost() {
        return this.config.webSocket.host;
    }
}
