import { Queue } from 'bullmq';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NaverNewsCrawlerQueueType } from './naver-news-crawler.types';
import {
    KoreaInvestmentSettingHelperService,
    KoreaInvestmentSettingKey,
} from '@app/modules/korea-investment-setting';

@Injectable()
export class NaverNewsCrawlerSchedule implements OnModuleInit {
    private readonly logger = new Logger(NaverNewsCrawlerSchedule.name);

    constructor(
        private readonly koreaInvestmentSettingHelperService: KoreaInvestmentSettingHelperService,
        @Inject(NaverNewsCrawlerQueueType.CrawlingNaverNews)
        private readonly queue: Queue,
    ) {}

    onModuleInit() {
        this.requestNaverNewsCrawling();
    }

    @Cron('*/3 * * * *')
    async requestNaverNewsCrawling() {
        try {
            const keywords = await this.koreaInvestmentSettingHelperService
                .getSettingSet(KoreaInvestmentSettingKey.Keywords)
                .list();
            if (!keywords.length) {
                return;
            }

            await this.queue.addBulk(
                keywords.map((keyword) => {
                    return {
                        name: NaverNewsCrawlerQueueType.CrawlingNaverNews,
                        queueName: NaverNewsCrawlerQueueType.CrawlingNaverNews,
                        data: {
                            keyword,
                        },
                    };
                }),
            );
        } catch (error) {
            this.logger.error(error);
        }
    }
}
