import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { StockPlusModule } from '@modules/stock-plus';
import { NaverApiModule } from '@modules/naver/naver-api';
import { KoreaInvestmentAdditionalRequestApiModule } from '@app/modules/korea-investment-request-api/korea-investment-additional-request-api';
import { NewsModule } from '@app/modules/repositories/news';
import { FavoriteStockModule } from '@app/modules/repositories/favorite-stock';
import { KeywordModule } from '@app/modules/repositories/keyword';
import { NewsCrawlerQueueType } from './news-crawler.types';
import {
    KoreaInvestmentNewsProcessor,
    NaverNewsProcessor,
    StockPlusNewsProcessor,
} from './processors';
import { NewsCrawlerSchedule } from './news-crawler.schedule';

const flowTypes = [NewsCrawlerQueueType.RequestDomesticNewsTitle];
const flowProviders = QueueModule.getFlowProviders(flowTypes);

const queueTypes = [
    NewsCrawlerQueueType.CrawlingNaverNews,
    NewsCrawlerQueueType.CrawlingNaverNewsForStockCode,
    NewsCrawlerQueueType.CrawlingStockPlusNews,
];
const queueProviders = QueueModule.getQueueProviders(queueTypes);
const processors = [
    KoreaInvestmentNewsProcessor,
    NaverNewsProcessor,
    StockPlusNewsProcessor,
];

@Module({
    imports: [
        QueueModule.forFeature({
            queueTypes,
            flowTypes,
            jobOptions: {
                removeOnComplete: {
                    count: 3,
                },
                removeOnFail: {
                    count: 5,
                },
            },
        }),
        KoreaInvestmentAdditionalRequestApiModule,
        NaverApiModule,
        StockPlusModule,
        NewsModule,
        FavoriteStockModule,
        KeywordModule,
    ],
    providers: [
        ...queueProviders,
        ...flowProviders,
        ...processors,
        NewsCrawlerSchedule,
    ],
})
export class NewsCrawlerModule {}
