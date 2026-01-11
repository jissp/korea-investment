import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
    KoreaInvestmentConfig,
    KoreaInvestmentConfigProvider,
} from './korea-investment-config.types';
import { KoreaInvestmentConfigService } from './korea-investment-config.service';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: KoreaInvestmentConfigProvider.AppConfig,
            inject: [ConfigService],
            useFactory: (
                configService: ConfigService,
            ): KoreaInvestmentConfig => {
                return configService.get<KoreaInvestmentConfig>(
                    'koreaInvestment',
                )!;
            },
        },
        KoreaInvestmentConfigService,
    ],
    exports: [KoreaInvestmentConfigService],
})
export class KoreaInvestmentConfigModule {}
