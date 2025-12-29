import { Module } from '@nestjs/common';
import { NaverApiModule } from '@modules/naver';
import { QueueModule } from '@modules/queue';
import { KoreaInvestmentAccountModule } from '@app/modules/korea-investment-account';
import { NewsModule } from '@app/modules/news';
import { NaverNewsCrawlerQueueType } from './naver-news-crawler.types';
import { NaverNewsCrawlerProcessor } from './naver-news-crawler.processor';
import { NaverNewsCrawlerSchedule } from './naver-news-crawler.schedule';

const queueTypes = [NaverNewsCrawlerQueueType.CrawlingNaverNews];
const queueProviders = QueueModule.getQueueProviders(queueTypes);

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
        KoreaInvestmentAccountModule,
        NaverApiModule,
        NewsModule,
    ],
    providers: [
        ...queueProviders,
        NaverNewsCrawlerProcessor,
        NaverNewsCrawlerSchedule,
    ],
})
export class NaverNewsCrawlerModule {}
