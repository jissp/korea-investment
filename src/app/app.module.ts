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
import { StockModule } from '@app/modules/stock';
import { StockKeywordModule } from '@app/modules/stock-keyword';
import { NaverNewsModule } from '@app/modules/naver-news';
import { StockPlusNewsCrawlerModule } from '@app/modules/stock-plus-news-cralwer';
import configuration from './configuration';
import {
    AssetController,
    InformationController,
    LatestStockRankController,
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
        KoreaInvestmentSettingModule,
        KoreaInvestmentNewsCrawlerModule,
        KoreaInvestmentQuotationClientModule,
        KoreaInvestmentRankClientModule,
        StockPlusNewsCrawlerModule,
        StockRepositoryModule,
        CrawlerModule,
        NaverNewsCrawlerModule,
        StockModule,
        StockKeywordModule,
        NaverNewsModule,
    ],
    controllers: [
        AssetController,
        InformationController,
        StockController,
        StockIndexController,
        LatestStockRankController,
    ],
    providers: [KoreaInvestmentBeGateway],
})
export class AppModule {}
