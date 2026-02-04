import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import {
    MiddlewareConsumer,
    Module,
    NestModule,
    NotFoundException,
    RequestMethod,
} from '@nestjs/common';
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
import { SlackModule } from '@modules/slack';
import { StockLoaderMiddleware } from '@app/common/middlewares';
import { KoreaInvestmentRequestApiModule } from '@app/modules/korea-investment-request-api';
import { KoreaInvestmentCollectorModule } from '@app/modules/korea-investment-collector';
import { AnalyzerModule } from '@app/modules/analysis/analyzer';
import { AiAnalyzerModule } from '@app/modules/analysis/ai-analyzer';
import { CrawlerModule } from '@app/modules/crawlers';
import { AppServiceModule } from '@app/modules/app-services';
import { RepositoryModule } from '@app/modules/repositories';
import configuration, { IConfiguration } from './configuration';
import {
    AccountController,
    AccountStockController,
    AnalysisController,
    FavoriteStockController,
    KeywordController,
    KeywordGroupController,
    LatestStockRankController,
    MarketController,
    MarketIndexController,
    NewsController,
    StockController,
    StockInvestorController,
    ThemeController,
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
                    throw new NotFoundException(
                        'Database configuration is missing',
                    );
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
        SlackModule.forRoot(),
        CrawlerModule,
        AiAnalyzerModule,
        AppServiceModule,
        RepositoryModule,
        KoreaInvestmentRequestApiModule,
        AnalyzerModule,
    ],
    controllers: [
        MarketController,
        MarketIndexController,
        AccountController,
        AccountStockController,
        FavoriteStockController,
        StockController,
        StockInvestorController,
        KeywordController,
        KeywordGroupController,
        ThemeController,
        NewsController,
        LatestStockRankController,
        AnalysisController,
    ],
    providers: [KoreaInvestmentBeGateway],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        const paths = [
            'v1/stocks/:stockCode',
            'v1/stocks/:stockCode/*',
            'v1/favorite-stocks/:stockCode',
        ];

        consumer.apply(StockLoaderMiddleware).forRoutes(
            ...paths.map((path) => ({
                path,
                method: RequestMethod.ALL,
            })),
        );
    }
}
