import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from '@modules/logger';
import { RedisConfig, RedisModule } from '@modules/redis';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { KoreaInvestmentCollectorModule } from '@app/modules/korea-investment-collector';
import { KoreaInvestmentQuotationClientModule } from '@modules/korea-investment/korea-investment-client/korea-investment-quotation-client';
import { KoreaInvestmentRankClientModule } from '@modules/korea-investment/korea-investment-client/korea-investment-rank-client';
import configuration from './configuration';
import {
    AssetController,
    QuotationController,
    RankController,
} from './controllers';
import { KoreaInvestmentBeGateway } from './gateways';

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
        KoreaInvestmentQuotationClientModule,
        KoreaInvestmentRankClientModule,
    ],
    controllers: [AssetController, QuotationController, RankController],
    providers: [KoreaInvestmentBeGateway],
})
export class AppModule {}
