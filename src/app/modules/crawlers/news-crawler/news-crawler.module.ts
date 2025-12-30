import { Module } from '@nestjs/common';
import { StockPlusModule } from '@modules/stock-plus';
import { NewsModule } from '@app/modules/news';
import { QueueModule } from '@modules/queue';
import { NaverApiModule } from '@modules/naver';
import { KoreaInvestmentHelperModule } from '@modules/korea-investment/korea-investment-helper';
import { KoreaInvestmentRequestApiModule } from '@app/modules/korea-investment-request-api';
import { KoreaInvestmentAccountModule } from '@app/modules/korea-investment-account';
import { NewsCrawlerQueueType } from './news-crawler.types';
import { KoreaInvestmentNewsProcessor, NaverNewsProcessor } from './processors';
import { NewsCrawlerSchedule } from './news-crawler.schedule';

const queueTypes = [
    NewsCrawlerQueueType.CrawlingNaverNews,
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
                    age: 86400,
                    count: 3,
                },
                removeOnFail: {
                    age: 86400,
                    count: 10,
                },
            },
        }),
        KoreaInvestmentHelperModule,
        KoreaInvestmentRequestApiModule,
        KoreaInvestmentAccountModule,
        NewsModule,
        NaverApiModule,
        StockPlusModule,
    ],
    providers: [...queueProviders, ...processors, NewsCrawlerSchedule],
})
export class NewsCrawlerModule {}
