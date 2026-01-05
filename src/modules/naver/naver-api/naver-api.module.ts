import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NaverConfig } from '@modules/naver/common';
import { NaverApiProvider } from './naver-api.types';
import { NaverApiClientFactory } from './naver-api-client.factory';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: NaverApiProvider.NaverApiConfig,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return configService.get<NaverConfig>('naver');
            },
        },
        NaverApiClientFactory,
    ],
    exports: [NaverApiClientFactory],
})
export class NaverApiModule {}
