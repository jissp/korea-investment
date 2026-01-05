import * as _ from 'lodash';
import { FlowProducer, Queue } from 'bullmq';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PreventConcurrentExecution } from '@common/decorators';
import { getDefaultJobOptions } from '@modules/queue';
import { KoreaInvestmentHelperService } from '@modules/korea-investment/korea-investment-helper';
import {
    KeywordType,
    KoreaInvestmentKeywordSettingService,
    KoreaInvestmentSettingService,
} from '@app/modules/korea-investment-setting';
import {
    KoreaInvestmentRequestApiHelper,
    KoreaInvestmentRequestApiType,
} from '@app/modules/korea-investment-request-api';
import {
    CrawlingNaverNewsJobPayload,
    NewsCrawlerQueueType,
} from './news-crawler.types';

@Injectable()
export class NewsCrawlerSchedule implements OnModuleInit {
    private readonly logger = new Logger(NewsCrawlerSchedule.name);

    constructor(
        private readonly koreaInvestmentRequestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly koreaInvestmentHelper: KoreaInvestmentHelperService,
        private readonly settingService: KoreaInvestmentSettingService,
        private readonly keywordSettingService: KoreaInvestmentKeywordSettingService,
        @Inject(NewsCrawlerQueueType.RequestDomesticNewsTitle)
        private readonly requestDomesticNewsTitleFlow: FlowProducer,
        @Inject(NewsCrawlerQueueType.CrawlingNaverNews)
        private readonly crawlingNaverNewsQueue: Queue<CrawlingNaverNewsJobPayload>,
        @Inject(NewsCrawlerQueueType.CrawlingNaverNewsForStockCode)
        private readonly crawlingNaverNewsForStockCode: Queue<CrawlingNaverNewsJobPayload>,
        @Inject(NewsCrawlerQueueType.CrawlingStockPlusNews)
        private readonly stockPlusNewsQueue: Queue,
    ) {}

    onModuleInit() {
        this.handleCrawlingKoreaInvestmentNewsByStockCode();
        this.requestNaverNewsCrawlingForKeyword();
        this.requestNaverNewsCrawlingForStockCode();
        this.handleCrawlingStockPlusNews();
    }

    @Cron('*/1 * * * *')
    @PreventConcurrentExecution()
    async handleCrawlingKoreaInvestmentNewsByStockCode() {
        try {
            const stockCodes = await this.settingService.getStockCodes();
            if (!stockCodes.length) {
                return;
            }

            const startDate = this.koreaInvestmentHelper.formatDateParam(
                new Date(),
            );

            const queueName = NewsCrawlerQueueType.RequestDomesticNewsTitle;

            for (const chunk of _.chunk(stockCodes, 5)) {
                await Promise.allSettled(
                    chunk.map((stockCode) =>
                        this.requestDomesticNewsTitleFlow.add(
                            {
                                name: queueName,
                                queueName,
                                children: [
                                    this.buildRequestApiChildren(
                                        startDate,
                                        stockCode,
                                    ),
                                ],
                            },
                            {
                                queuesOptions: {
                                    [queueName]: {
                                        defaultJobOptions:
                                            getDefaultJobOptions(),
                                    },
                                    [KoreaInvestmentRequestApiType]: {
                                        defaultJobOptions:
                                            getDefaultJobOptions(),
                                    },
                                },
                            },
                        ),
                    ),
                );
            }
        } catch (error) {
            this.logger.error(error);
        }
    }

    @Cron('*/3 * * * *')
    @PreventConcurrentExecution()
    async requestNaverNewsCrawlingForKeyword() {
        try {
            const keywords = await this.keywordSettingService.getKeywords([
                KeywordType.Manual,
            ]);
            if (!keywords.length) {
                return;
            }

            const uniqueKeywords = Array.from(new Set(keywords));

            await this.crawlingNaverNewsQueue.addBulk(
                uniqueKeywords.map((keyword) => {
                    return {
                        name: NewsCrawlerQueueType.CrawlingNaverNews,
                        queueName: NewsCrawlerQueueType.CrawlingNaverNews,
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

    @Cron('*/3 * * * *')
    @PreventConcurrentExecution()
    async requestNaverNewsCrawlingForStockCode() {
        try {
            const keywords = await this.keywordSettingService.getKeywords([
                KeywordType.StockGroup,
                KeywordType.Possess,
                KeywordType.Favorite,
            ]);

            const uniqueKeywords = Array.from(new Set(keywords));

            await this.crawlingNaverNewsForStockCode.addBulk(
                uniqueKeywords.map((keyword) => {
                    return {
                        name: NewsCrawlerQueueType.CrawlingNaverNewsForStockCode,
                        queueName:
                            NewsCrawlerQueueType.CrawlingNaverNewsForStockCode,
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

    @Cron('*/1 * * * *')
    @PreventConcurrentExecution()
    async handleCrawlingStockPlusNews() {
        try {
            await this.stockPlusNewsQueue.add(
                NewsCrawlerQueueType.CrawlingStockPlusNews,
                {},
                {
                    removeOnComplete: {
                        count: 3,
                    },
                    removeOnFail: {
                        count: 5,
                    },
                },
            );
        } catch (error) {
            this.logger.error(error);
        }
    }

    private buildRequestApiChildren(startDate: string, stockCode: string) {
        return this.koreaInvestmentRequestApiHelper.generateDomesticNewsTitle({
            FID_INPUT_DATE_1: `00${startDate}`,
            FID_NEWS_OFER_ENTP_CODE: '',
            FID_COND_MRKT_CLS_CODE: '',
            FID_INPUT_ISCD: stockCode,
            FID_TITL_CNTT: '',
            FID_INPUT_HOUR_1: '',
            FID_RANK_SORT_CLS_CODE: '',
            FID_INPUT_SRNO: '',
        });
    }
}
