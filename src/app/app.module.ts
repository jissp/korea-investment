import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from '@modules/logger';
import { RedisConfig, RedisModule } from '@modules/redis';
import { QueueModule } from '@modules/queue';
import { KoreaInvestmentCollectorModule } from '@app/modules/korea-investment-collector';
import { KoreaInvestmentQuotationClientModule } from '@modules/korea-investment/korea-investment-quotation-client';
import { KoreaInvestmentRankClientModule } from '@modules/korea-investment/korea-investment-rank-client';
import { KoreaInvestmentSettingModule } from '@app/modules/korea-investment-setting';
import { GeminiCliModule } from '@modules/gemini-cli';
import { NewsRepositoryModule } from '@app/modules/repositories/news-repository';
import { StockRepositoryModule } from '@app/modules/stock-repository';
import {
    AccountRepositoryModule,
    AnalysisRepositoryModule,
    IndexRepositoryModule,
} from '@app/modules/repositories';
import { CrawlerModule } from '@app/modules/crawlers/crawler';
import { NewsCrawlerModule } from '@app/modules/crawlers/news-crawler';
import { KoreaInvestmentIndexCrawlerModule } from '@app/modules/crawlers/korea-investment-index-crawler';
import { KoreaInvestmentAccountCrawlerModule } from '@app/modules/crawlers/korea-investment-account-crawler';
import { StockAnalyzerModule } from '@app/modules/stock-analyzer';
import { AppServiceModule } from '@app/modules/services';
import configuration from './configuration';
import {
    KoreaInvestmentKeywordListener,
    KoreaInvestmentStockCodeListener,
} from './listeners';
import {
    AccountController,
    AnalysisController,
    AssetController,
    FavoriteStockController,
    KeywordController,
    KeywordGroupController,
    LatestStockRankController,
    NewsController,
    StockController,
    StockIndexController,
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
        KoreaInvestmentSettingModule.forRoot(),
        KoreaInvestmentQuotationClientModule,
        KoreaInvestmentRankClientModule,
        StockRepositoryModule,
        IndexRepositoryModule,
        AccountRepositoryModule,
        AnalysisRepositoryModule,
        NewsRepositoryModule,
        CrawlerModule,
        NewsCrawlerModule,
        KoreaInvestmentAccountCrawlerModule,
        KoreaInvestmentIndexCrawlerModule,
        StockAnalyzerModule,
        AppServiceModule,
    ],
    controllers: [
        AssetController,
        AccountController,
        AnalysisController,
        NewsController,
        LatestStockRankController,
        StockController,
        StockIndexController,
        FavoriteStockController,
        KeywordController,
        KeywordGroupController,
    ],
    providers: [
        KoreaInvestmentKeywordListener,
        KoreaInvestmentStockCodeListener,
        KoreaInvestmentBeGateway,
    ],
})
export class AppModule {}
