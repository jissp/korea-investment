import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from '@modules/logger';
import { RedisConfig, RedisModule } from '@modules/redis';
import { QueueModule } from '@modules/queue';
import { GeminiCliModule } from '@modules/gemini-cli';
import { KoreaInvestmentQuotationClientModule } from '@modules/korea-investment/korea-investment-quotation-client';
import { KoreaInvestmentRankClientModule } from '@modules/korea-investment/korea-investment-rank-client';
import { KoreaInvestmentCollectorModule } from '@app/modules/korea-investment-collector';
import { StockAnalyzerModule } from '@app/modules/stock-analyzer';
import { CrawlerModule } from '@app/modules/crawlers';
import { AppServiceModule } from '@app/modules/services';
import { RepositoryModule } from '@app/modules/repositories';
import configuration, { IConfiguration } from './configuration';
import {
    AccountController,
    AnalysisController,
    FavoriteStockController,
    KeywordController,
    KeywordGroupController,
    LatestStockRankController,
    MarketIndexController,
    NewsController,
    StockController,
    StockDailyInvestorController,
} from './controllers';
import { KoreaInvestmentBeGateway } from './gateways';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
        }),
        LoggerModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (
                configService: ConfigService,
            ): TypeOrmModuleOptions => {
                const config =
                    configService.get<IConfiguration['database']>('database');
                if (!config) {
                    throw new Error('Database configuration is missing');
                }

                return {
                    type: 'mysql',
                    timezone: 'Z',
                    host: config.host,
                    database: config.database,
                    username: config.userName,
                    password: config.password,
                    port: Number(config.port),
                    synchronize: false,
                    autoLoadEntities: true,
                    namingStrategy: new SnakeNamingStrategy(),
                    extra: {
                        decimalNumbers: true,
                    },
                };
            },
        }),
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService): RedisConfig => {
                return configService.get<RedisConfig>('redis')!;
            },
        }),
        QueueModule.forRootAsync(),
        EventEmitterModule.forRoot({
            wildcard: true,
        }),
        ScheduleModule.forRoot(),
        GeminiCliModule,
        KoreaInvestmentCollectorModule.forRoot(),
        KoreaInvestmentQuotationClientModule,
        KoreaInvestmentRankClientModule,
        CrawlerModule,
        StockAnalyzerModule,
        AppServiceModule,
        RepositoryModule,
    ],
    controllers: [
        AccountController,
        AnalysisController,
        NewsController,
        LatestStockRankController,
        StockController,
        StockDailyInvestorController,
        MarketIndexController,
        FavoriteStockController,
        KeywordController,
        KeywordGroupController,
    ],
    providers: [KoreaInvestmentBeGateway],
})
export class AppModule {}
