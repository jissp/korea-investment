import { Module } from '@nestjs/common';
import { NaverApiModule } from '@modules/naver';
import { QueueModule } from '@modules/queue';
import { KoreaInvestmentSettingModule } from '@app/modules/korea-investment-setting';
import { NaverNewsModule } from '@app/modules/naver-news';
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
        NaverApiModule,
        NaverNewsModule,
        KoreaInvestmentSettingModule,
    ],
    providers: [
        ...queueProviders,
        NaverNewsCrawlerProcessor,
        NaverNewsCrawlerSchedule,
    ],
})
export class NaverNewsCrawlerModule {}
