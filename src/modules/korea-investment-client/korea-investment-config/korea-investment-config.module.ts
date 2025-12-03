import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IConfiguration } from '@app/configuration';
import { KoreaInvestmentConfigService } from './korea-investment-config.service';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: 'APP_CONFIG',
            inject: [ConfigService],
            useFactory: (
                configService: ConfigService,
            ): IConfiguration['koreaInvestment'] => {
                return configService.get<IConfiguration['koreaInvestment']>(
                    'koreaInvestment',
                )!;
            },
        },
        KoreaInvestmentConfigService,
    ],
    exports: [KoreaInvestmentConfigService],
})
export class KoreaInvestmentConfigModule {}
