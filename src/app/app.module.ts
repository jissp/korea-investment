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
import { NewsModule } from '@app/modules/news';
import { StockRepositoryModule } from '@app/modules/stock-repository';
import {
    AccountRepositoryModule,
    IndexRepositoryModule,
} from '@app/modules/repositories';
import { CrawlerModule } from '@app/modules/crawlers/crawler';
import { NewsCrawlerModule } from '@app/modules/crawlers/news-crawler';
import { KoreaInvestmentIndexCrawlerModule } from '@app/modules/crawlers/korea-investment-index-crawler';
import { KoreaInvestmentAccountCrawlerModule } from '@app/modules/crawlers/korea-investment-account-crawler';
import configuration from './configuration';
import {
    KoreaInvestmentKeywordListener,
    KoreaInvestmentStockCodeListener,
} from './listeners';
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
            useFactory: (configService: ConfigService): RedisConfig => {
                return configService.get<RedisConfig>('redis')!;
            },
        }),
        QueueModule.forRootAsync(),
        EventEmitterModule.forRoot({
            wildcard: true,
        }),
        ScheduleModule.forRoot(),
        KoreaInvestmentCollectorModule.forRoot(),
        KoreaInvestmentSettingModule.forRoot(),
        KoreaInvestmentQuotationClientModule,
        KoreaInvestmentRankClientModule,
        StockRepositoryModule,
        IndexRepositoryModule,
        AccountRepositoryModule,
        NewsModule,
        CrawlerModule,
        NewsCrawlerModule,
        KoreaInvestmentAccountCrawlerModule,
        KoreaInvestmentIndexCrawlerModule,
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
    providers: [
        KoreaInvestmentKeywordListener,
        KoreaInvestmentStockCodeListener,
        KoreaInvestmentBeGateway,
    ],
})
export class AppModule {}
