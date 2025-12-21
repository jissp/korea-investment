import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from '@modules/logger';
import { RedisConfig, RedisModule } from '@modules/redis';
import { QueueModule } from '@modules/queue';
import { KoreaInvestmentCollectorModule } from '@app/modules/korea-investment-collector';
import { KoreaInvestmentNewsCrawlerModule } from '@app/modules/korea-investment-news-crawler';
import { KoreaInvestmentQuotationClientModule } from '@modules/korea-investment/korea-investment-quotation-client';
import { KoreaInvestmentRankClientModule } from '@modules/korea-investment/korea-investment-rank-client';
import { CrawlerModule } from '@app/modules/crawler';
import { NaverNewsCrawlerModule } from '@app/modules/naver-news-crawler';
import { StockRepositoryModule } from '@app/modules/stock-repository';
import { KoreaInvestmentSettingModule } from '@app/modules/korea-investment-setting';
import { StockPlusNewsCrawlerModule } from '@app/modules/stock-plus-news-cralwer';
import { KoreaInvestmentAccountCrawlerModule } from '@app/modules/korea-investment-account-crawler';
import { KoreaInvestmentAccountModule } from '@app/modules/korea-investment-account';
import { NewsModule } from '@app/modules/news';
import configuration from './configuration';
import {
    AccountController,
    AssetController,
    FavoriteStockController,
    KeywordController,
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
            useFactory: async (
                configService: ConfigService,
            ): Promise<RedisConfig> => {
                return configService.get<RedisConfig>('redis')!;
            },
        }),
        QueueModule.forRootAsync(),
        EventEmitterModule.forRoot(),
        ScheduleModule.forRoot(),
        KoreaInvestmentCollectorModule.forRoot(),
        KoreaInvestmentSettingModule.forRoot(),
        KoreaInvestmentNewsCrawlerModule,
        KoreaInvestmentQuotationClientModule,
        KoreaInvestmentRankClientModule,
        KoreaInvestmentAccountModule,
        StockPlusNewsCrawlerModule,
        StockRepositoryModule,
        CrawlerModule,
        NaverNewsCrawlerModule,
        NewsModule,
        KoreaInvestmentAccountCrawlerModule,
    ],
    controllers: [
        AssetController,
        AccountController,
        NewsController,
        LatestStockRankController,
        StockController,
        StockIndexController,
        FavoriteStockController,
        KeywordController,
    ],
    providers: [KoreaInvestmentBeGateway],
})
export class AppModule {}
