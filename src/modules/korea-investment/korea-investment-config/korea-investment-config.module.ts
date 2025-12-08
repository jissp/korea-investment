import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KoreaInvestmentConfig } from './korea-investment-config.types';
import { KoreaInvestmentConfigService } from './korea-investment-config.service';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: 'APP_CONFIG',
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
