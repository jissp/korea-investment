import { Inject, Injectable } from '@nestjs/common';
import { AppCredentials } from '@modules/korea-investment-client/common';
import { KoreaInvestmentConfig } from './korea-investment-config.types';

@Injectable()
export class KoreaInvestmentConfigService {
    constructor(
        @Inject('APP_CONFIG') private readonly config: KoreaInvestmentConfig,
    ) {}

    public getCredentials(): AppCredentials {
        return {
            appkey: this.config.key,
            appsecret: this.config.secret,
        };
    }

    public getHost() {
        return this.config.host;
    }
}
