import axios from 'axios';
import axiosRetry from 'axios-retry';
import { Module } from '@nestjs/common';
import { RedisModule } from '@modules/redis';
import {
    KoreaInvestmentConfigModule,
    KoreaInvestmentConfigService,
} from '@modules/korea-investment/korea-investment-config';
import { KoreaInvestmentOauthClientModule } from '@modules/korea-investment/korea-investment-oauth-client';
import { KoreaInvestmentHelperService } from './korea-investment-helper.service';

@Module({
    imports: [
        RedisModule.forFeature(),
        KoreaInvestmentConfigModule,
        KoreaInvestmentOauthClientModule,
    ],
    providers: [
        {
            provide: 'Client',
            inject: [KoreaInvestmentConfigService],
            useFactory: (configService: KoreaInvestmentConfigService) => {
                const host = configService.getHost();

                const client = axios.create({
                    baseURL: host,
                });

                axiosRetry(client, {
                    retries: 3,
                    retryCondition: (err) => {
                        return err.isAxiosError;
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
