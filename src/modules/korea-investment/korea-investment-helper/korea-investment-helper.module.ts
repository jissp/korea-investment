import axios from 'axios';
import axiosRetry from 'axios-retry';
import { DynamicModule, HttpStatus, Module } from '@nestjs/common';
import { RedisModule } from '@modules/redis';
import { CustomerType } from '@modules/korea-investment/common';
import {
    KoreaInvestmentConfigModule,
    KoreaInvestmentConfigService,
} from '@modules/korea-investment/korea-investment-config';
import { KoreaInvestmentOauthClientModule } from '@modules/korea-investment/korea-investment-oauth-client';
import {
    CredentialType,
    KoreaInvestmentHelperConfig,
    KoreaInvestmentHelperProvider,
} from './korea-investment-helper.types';
import { KoreaInvestmentHelperService } from './korea-investment-helper.service';

@Module({})
export class KoreaInvestmentHelperModule {
    public static forFeature(credentialType: CredentialType): DynamicModule {
        return {
            module: KoreaInvestmentHelperModule,
            imports: [
                RedisModule.forFeature(),
                KoreaInvestmentConfigModule,
                KoreaInvestmentOauthClientModule,
            ],
            providers: [
                {
                    provide: KoreaInvestmentHelperProvider.Config,
                    inject: [KoreaInvestmentConfigService],
                    useFactory: (
                        configService: KoreaInvestmentConfigService,
                    ): KoreaInvestmentHelperConfig => {
                        const host = configService.getHost();
                        const websocketHost = configService.getWebSocketHost();

                        const credential =
                            credentialType === CredentialType.Main
                                ? configService.getCredential()
                                : configService.getAdditionalCredential();

                        return {
                            host,
                            websocketHost,
                            credentialType,
                            credential,
                        };
                    },
                },
                {
                    provide: KoreaInvestmentHelperProvider.Client,
                    inject: [KoreaInvestmentHelperProvider.Config],
                    useFactory: (config: KoreaInvestmentHelperConfig) => {
                        const client = axios.create({
                            baseURL: config.host,
                            headers: {
                                'content-type':
                                    'application/json; charset=utf-8',
                                appkey: config.credential.appkey,
                                appsecret: config.credential.appsecret,
                                custtype: CustomerType.Personal,
                            },
                        });

                        axiosRetry(client, {
                            retries: 3,
                            retryCondition: (err) => {
                                // 재시도할 가치가 있는 에러만 필터링
                                if (!err.response) {
                                    return true; // 네트워크 에러
                                }

                                return [
                                    HttpStatus.REQUEST_TIMEOUT,
                                    HttpStatus.TOO_MANY_REQUESTS,
                                    HttpStatus.INTERNAL_SERVER_ERROR,
                                ].includes(err.response.status);
                            },
                            retryDelay: () => 250,
                        });

                        return client;
                    },
                },
                KoreaInvestmentHelperService,
            ],
            exports: [KoreaInvestmentHelperService],
        };
    }
}
