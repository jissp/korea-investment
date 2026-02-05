import { FlowProducer } from 'bullmq';
import { FlowJob } from 'bullmq/dist/esm/interfaces';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { toDateYmdByDate } from '@common/utils';
import { PreventConcurrentExecution } from '@common/decorators';
import { getDefaultJobOptions } from '@modules/queue';
import { KoreaInvestmentRequestApiHelper } from '@app/modules/korea-investment-request-api/common';
import {
    NewsCrawlerQueueType,
    NewsStrategy,
    RequestCrawlingNewsJobPayload,
} from './news-crawler.types';

@Injectable()
export class NewsCrawlerSchedule implements OnModuleInit {
    private readonly logger = new Logger(NewsCrawlerSchedule.name);

    constructor(
        private readonly koreaInvestmentRequestApiHelper: KoreaInvestmentRequestApiHelper,
        @Inject(NewsCrawlerQueueType.RequestCrawlingNews)
        private readonly requestCrawlingNews: FlowProducer,
    ) {}

    onModuleInit() {
        this.handleCrawlingNews();
        this.handleCrawlingNewsForKoreaInvestment();
    }

    @Cron('*/1 * * * *')
    @PreventConcurrentExecution()
    async handleCrawlingNews() {
        const queueName = NewsCrawlerQueueType.RequestCrawlingNews;
        const jobPayloads = Object.values(NewsStrategy).map((strategy) =>
            this.generateJobPayload(strategy),
        );

        const queuesOptions = {
            [queueName]: {
                defaultJobOptions: getDefaultJobOptions(),
            },
        };

        await Promise.allSettled(
            jobPayloads.map((jobPayload) =>
                this.requestCrawlingNews.add(jobPayload, {
                    queuesOptions,
                }),
            ),
        );
    }

    @Cron('*/30 * * * * *')
    @PreventConcurrentExecution()
    async handleCrawlingNewsForKoreaInvestment() {
        const queueName = NewsCrawlerQueueType.RequestCrawlingNews;
        const jobPayload = this.generateJobPayload(
            NewsStrategy.KoreaInvestment,
        );

        const startDate = toDateYmdByDate();

        jobPayload.children = [
            this.koreaInvestmentRequestApiHelper.generateDomesticNewsTitle({
                FID_INPUT_DATE_1: `00${startDate}`,
                FID_NEWS_OFER_ENTP_CODE: '',
                FID_COND_MRKT_CLS_CODE: '',
                FID_INPUT_ISCD: '',
                FID_TITL_CNTT: '',
                FID_INPUT_HOUR_1: '',
                FID_RANK_SORT_CLS_CODE: '',
                FID_INPUT_SRNO: '',
            }),
        ];

        const queuesOptions = {
            [queueName]: {
                defaultJobOptions: getDefaultJobOptions(),
            },
        };

        await this.requestCrawlingNews.add(jobPayload, {
            queuesOptions,
        });
    }

    /**
     * @private
     * @param strategy
     */
    private generateJobPayload<T extends NewsStrategy>(strategy: T): FlowJob {
        const queueName = NewsCrawlerQueueType.RequestCrawlingNews;

        return {
            queueName,
            name: queueName,
            data: {
                strategy,
            } as RequestCrawlingNewsJobPayload<T>,
            opts: {
                jobId: strategy,
            },
        };
    }
}
