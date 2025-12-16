import axios from 'axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NaverConfig } from '@modules/naver/common';
import { NaverApiClient } from './naver-api.client';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: 'NaverApiConfig',
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return configService.get<NaverConfig>('naver');
            },
        },
        {
            provide: 'Client',
            inject: ['NaverApiConfig'],
            useFactory: (config: NaverConfig) => {
                return axios.create({
                    baseURL: config.api.host,
                    headers: {
                        'X-Naver-Client-Id': config.api.key,
                        'X-Naver-Client-Secret': config.api.secret,
                    },
                    timeout: 5000,
                });
            },
        },
        NaverApiClient,
    ],
    exports: [NaverApiClient],
})
export class NaverApiModule {}
