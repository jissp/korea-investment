import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from '@modules/logger';
import { RedisConfig, RedisModule } from '@modules/redis';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { KoreaInvestmentModule } from '@app/modules/korea-investment';
import { KoreaInvestmentBeGatewayModule } from '@app/modules/korea-investment-be-gateway';
import { KoreaInvestmentCollectorModule } from '@app/modules/korea-investment-collector';
import configuration from './configuration';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
        }),
        LoggerModule.forRoot(),
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (
                configService: ConfigService,
            ): Promise<RedisConfig> => {
                return configService.get<RedisConfig>('redis')!;
            },
        }),
        EventEmitterModule.forRoot(),
        KoreaInvestmentCollectorModule.forRoot(),
        KoreaInvestmentBeGatewayModule,
        KoreaInvestmentModule,
    ],
})
export class AppModule {}
