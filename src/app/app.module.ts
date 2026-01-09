import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from '@modules/logger';
import { RedisConfig, RedisModule } from '@modules/redis';
import { QueueModule } from '@modules/queue';
import { KoreaInvestmentCollectorModule } from '@app/modules/korea-investment-collector';
import { KoreaInvestmentQuotationClientModule } from '@modules/korea-investment/korea-investment-quotation-client';
import { KoreaInvestmentRankClientModule } from '@modules/korea-investment/korea-investment-rank-client';
import { GeminiCliModule } from '@modules/gemini-cli';
import { CrawlerModule } from '@app/modules/crawlers/crawler';
import { NewsCrawlerModule } from '@app/modules/crawlers/news-crawler';
import { KoreaInvestmentIndexCrawlerModule } from '@app/modules/crawlers/korea-investment-index-crawler';
import { StockCrawlerModule } from '@app/modules/crawlers/stock-crawler';
import { KoreaInvestmentAccountCrawlerModule } from '@app/modules/crawlers/korea-investment-account-crawler';
import { StockAnalyzerModule } from '@app/modules/stock-analyzer';
import { StockInvestorModule } from '@app/modules/services/stock-investor';
import { StockRepositoryModule } from '@app/modules/repositories/stock-repository';
import { AccountModule } from '@app/modules/repositories/account';
import { NewsModule } from '@app/modules/repositories/news';
import { KeywordModule } from '@app/modules/repositories/keyword';
import { FavoriteStockModule } from '@app/modules/repositories/favorite-stock';
import { MarketIndexModule } from '@app/modules/repositories/market-index';
import { AiAnalysisReportModule } from '@app/modules/repositories/ai-analysis-report';
import { StockDailyInvestorModule } from '@app/modules/repositories/stock-daily-investor';
import { AppServiceModule } from '@app/modules/services';
import configuration, { IConfiguration } from './configuration';
import {
    AccountController,
    AnalysisController,
    AssetController,
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
        NewsCrawlerModule,
        KoreaInvestmentAccountCrawlerModule,
        KoreaInvestmentIndexCrawlerModule,
        StockCrawlerModule,
        StockAnalyzerModule,
        StockInvestorModule,
        AppServiceModule,
        StockRepositoryModule,
        StockDailyInvestorModule,
        AccountModule,
        NewsModule,
        KeywordModule,
        FavoriteStockModule,
        MarketIndexModule,
        AiAnalysisReportModule,
    ],
    controllers: [
        AssetController,
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
