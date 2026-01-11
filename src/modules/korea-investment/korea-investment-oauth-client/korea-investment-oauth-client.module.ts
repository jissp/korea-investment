import axios from 'axios';
import { Module } from '@nestjs/common';
import {
    KoreaInvestmentConfigModule,
    KoreaInvestmentConfigService,
} from '@modules/korea-investment/korea-investment-config';
import { KoreaInvestmentOauthClientProvider } from './korea-investment-oauth-client.types';
import { KoreaInvestmentOauthClient } from './korea-investment-oauth.client';

@Module({
    imports: [KoreaInvestmentConfigModule],
    providers: [
        {
            provide: KoreaInvestmentOauthClientProvider.Client,
            inject: [KoreaInvestmentConfigService],
            useFactory: (configService: KoreaInvestmentConfigService) => {
                const host = configService.getHost();

                return axios.create({
                    baseURL: host,
                });
            },
        },
        KoreaInvestmentOauthClient,
    ],
    exports: [KoreaInvestmentOauthClient],
})
export class KoreaInvestmentOauthClientModule {}
