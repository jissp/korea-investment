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
import { KoreaInvestmentAccountModule } from '@app/modules/korea-investment-account';
import { NewsModule } from '@app/modules/news';
import { StockRepositoryModule } from '@app/modules/stock-repository';
import { CrawlerModule } from '@app/modules/crawlers/crawler';
import { KoreaInvestmentNewsCrawlerModule } from '@app/modules/crawlers/korea-investment-news-crawler';
import { NaverNewsCrawlerModule } from '@app/modules/crawlers/naver-news-crawler';
import { StockPlusNewsCrawlerModule } from '@app/modules/crawlers/stock-plus-news-cralwer';
import { KoreaInvestmentAccountCrawlerModule } from '@app/modules/crawlers/korea-investment-account-crawler';
import configuration from './configuration';
import { KoreaInvestmentKeywordListener } from './listeners';
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
        KoreaInvestmentQuotationClientModule,
        KoreaInvestmentRankClientModule,
        KoreaInvestmentAccountModule,
        StockRepositoryModule,
        NewsModule,
        CrawlerModule,
        NaverNewsCrawlerModule,
        StockPlusNewsCrawlerModule,
        KoreaInvestmentNewsCrawlerModule,
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
    providers: [KoreaInvestmentKeywordListener, KoreaInvestmentBeGateway],
})
export class AppModule {}
