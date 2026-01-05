import { Module } from '@nestjs/common';
import { StockPlusModule } from '@modules/stock-plus';
import { NewsRepositoryModule } from '@app/modules/repositories/news-repository';
import { QueueModule } from '@modules/queue';
import { NaverApiModule } from '@modules/naver/naver-api';
import { KoreaInvestmentHelperModule } from '@modules/korea-investment/korea-investment-helper';
import { KoreaInvestmentRequestApiModule } from '@app/modules/korea-investment-request-api';
import { NewsCrawlerQueueType } from './news-crawler.types';
import { KoreaInvestmentNewsProcessor, NaverNewsProcessor } from './processors';
import { NewsCrawlerSchedule } from './news-crawler.schedule';

const queueTypes = [
    NewsCrawlerQueueType.CrawlingNaverNews,
    NewsCrawlerQueueType.CrawlingNaverNewsForStockCode,
    NewsCrawlerQueueType.CrawlingStockPlusNews,
    NewsCrawlerQueueType.RequestDomesticNewsTitle,
];
const queueProviders = QueueModule.getQueueProviders(queueTypes);
const processors = [KoreaInvestmentNewsProcessor, NaverNewsProcessor];

@Module({
    imports: [
        QueueModule.forFeature({
            queueTypes,
            jobOptions: {
                removeOnComplete: {
                    count: 3,
                },
                removeOnFail: {
                    count: 5,
                },
            },
        }),
        KoreaInvestmentHelperModule,
        KoreaInvestmentRequestApiModule,
        NewsRepositoryModule,
        NaverApiModule,
        StockPlusModule,
    ],
    providers: [...queueProviders, ...processors, NewsCrawlerSchedule],
})
export class NewsCrawlerModule {}
