import axios from 'axios';
import axiosRetry from 'axios-retry';
import { HttpStatus, Module } from '@nestjs/common';
import { RedisModule } from '@modules/redis';
import {
    KoreaInvestmentConfigModule,
    KoreaInvestmentConfigService,
} from '@modules/korea-investment/korea-investment-config';
import { KoreaInvestmentOauthClientModule } from '@modules/korea-investment/korea-investment-oauth-client';
import { KoreaInvestmentHelperProvider } from './korea-investment-helper.types';
import { KoreaInvestmentHelperService } from './korea-investment-helper.service';

@Module({
    imports: [
        RedisModule.forFeature(),
        KoreaInvestmentConfigModule,
        KoreaInvestmentOauthClientModule,
    ],
    providers: [
        {
            provide: KoreaInvestmentHelperProvider.Client,
            inject: [KoreaInvestmentConfigService],
            useFactory: (configService: KoreaInvestmentConfigService) => {
                const host = configService.getHost();

                const client = axios.create({
                    baseURL: host,
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
})
export class KoreaInvestmentHelperModule {}
