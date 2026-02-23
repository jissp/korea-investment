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
import { AopModule } from '@toss/nestjs-aop';
import { RedisConfig, RedisModule } from '@modules/redis';
import { QueueModule } from '@modules/queue';
import { GeminiCliModule } from '@modules/gemini-cli';
import { KoreaInvestmentQuotationClientModule } from '@modules/korea-investment/korea-investment-quotation-client';
import { KoreaInvestmentRankClientModule } from '@modules/korea-investment/korea-investment-rank-client';
import { SlackModule } from '@modules/slack';
import { McpServerModule } from '@modules/mcp-server';
import { StockLoaderMiddleware } from '@app/common/middlewares';
import { AuthModule } from '@app/modules/auth';
import { KoreaInvestmentRequestApiModule } from '@app/modules/korea-investment-request-api';
import { KoreaInvestmentCollectorModule } from '@app/modules/korea-investment-collector';
import { AnalyzerModule } from '@app/modules/analysis/analyzer';
import { AiAnalyzerModule } from '@app/modules/analysis/ai-analyzer';
import { CrawlerModule } from '@app/modules/crawlers';
import { RepositoryModule } from '@app/modules/repositories';
import { StockModule } from '@app/modules/domain/stock';
import { FavoriteStockModule } from '@app/modules/domain/favorite-stock';
import { StockInvestorModule } from '@app/modules/domain/stock-investor';
import { AnalysisModule } from '@app/modules/domain/analysis';
import { AccountModule } from '@app/modules/domain/account';
import { ThemeModule } from '@app/modules/domain/theme';
import { LatestStockRankModule } from '@app/modules/domain/latest-stock-rank';
import { MarketModule } from '@app/modules/domain/market';
import { NewsModule } from '@app/modules/domain/news';
import { KeywordModule } from '@app/modules/domain/keyword';
import configuration, { IConfiguration } from './configuration';
import { KoreaInvestmentBeGateway } from './gateways';

@Module({
    imports: [
        AopModule,
        ConfigModule.forRoot({
            load: [configuration],
        }),
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
        AuthModule.forRoot(),
        ScheduleModule.forRoot(),
        GeminiCliModule,
        KoreaInvestmentCollectorModule.forRoot(),
        KoreaInvestmentQuotationClientModule,
        KoreaInvestmentRankClientModule,
        SlackModule.forRoot(),
        McpServerModule.forRoot({
            name: 'Korea Investment MCP Server',
            version: '1.0.0',
            description:
                'MCP server for Korea Investment analysis platform with Stock tools and Resources',
        }),
        CrawlerModule,
        AiAnalyzerModule,
        RepositoryModule,
        KoreaInvestmentRequestApiModule,
        AnalyzerModule,
        StockModule,
        FavoriteStockModule,
        StockInvestorModule,
        NewsModule,
        AnalysisModule,
        AccountModule,
        ThemeModule,
        LatestStockRankModule,
        MarketModule,
        KeywordModule,
    ],
    controllers: [],
    providers: [KoreaInvestmentBeGateway],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        const paths = [
            'v1/stocks/:stockCode/(.*)',
            'v1/stocks/:stockCode',
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
