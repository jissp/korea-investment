import axios from 'axios';
import { Module } from '@nestjs/common';
import { RedisModule } from '@modules/redis';
import {
    KoreaInvestmentConfigModule,
    KoreaInvestmentConfigService,
} from '@modules/korea-investment-client/korea-investment-config';
import { KoreaInvestmentOauthClientModule } from '@modules/korea-investment-client/korea-investment-oauth-client';
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

                return axios.create({
                    baseURL: host,
                });
            },
        },
        KoreaInvestmentHelperService,
    ],
    exports: [KoreaInvestmentHelperService],
})
export class KoreaInvestmentHelperModule {}
