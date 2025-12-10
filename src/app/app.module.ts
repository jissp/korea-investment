import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisConfig, RedisModule } from '@modules/redis';
import configuration from './configuration';
import { KoreaInvestmentModule } from './modules';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
        }),
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (
                configService: ConfigService,
            ): Promise<RedisConfig> => {
                return configService.get<RedisConfig>('redis')!;
            },
        }),
        KoreaInvestmentModule,
    ],
})
export class AppModule {}
