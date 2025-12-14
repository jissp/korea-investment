import { FlowProducer } from 'bullmq';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { getDefaultJobOptions } from '@modules/queue';
import { KoreaInvestmentHelperService } from '@modules/korea-investment/korea-investment-helper';
import { DomesticStockQuotationsNewsTitleParam } from '@modules/korea-investment/korea-investment-quotation-client';
import { StockPlusClient } from '@modules/stock-plus';
import { StockRepository } from '@app/modules/stock-repository';
import {
    CrawlerFlowType,
    CrawlerQueueType,
    KoreaInvestmentCallApiParam,
} from '../crawler.types';

@Injectable()
export class NewsSchedule implements OnModuleInit {
    private readonly logger: Logger = new Logger(NewsSchedule.name);

    constructor(
        private readonly koreaInvestmentHelper: KoreaInvestmentHelperService,
        private readonly stockPlusClient: StockPlusClient,
        private readonly stockRepository: StockRepository,
        @Inject(CrawlerFlowType.RequestDomesticNewsTitle)
        private readonly requestDomesticNewsTitleFlow: FlowProducer,
    ) {}

    onModuleInit() {
        this.handleCrawlingKoreaInvestmentNews();
        this.handleCrawlingStockPlusNews();
    }

    @Cron('*/30 * * * * *')
    async handleCrawlingKoreaInvestmentNews() {
        try {
            const currentDate = new Date();
            const koreaInvestmentDate =
                this.koreaInvestmentHelper.formatDateParam(currentDate);

            await this.requestDomesticNewsTitleFlow.add(
                {
                    name: CrawlerFlowType.RequestDomesticNewsTitle,
                    queueName: CrawlerFlowType.RequestDomesticNewsTitle,
                    children: [
                        {
                            name: CrawlerQueueType.RequestKoreaInvestmentApi,
                            queueName:
                                CrawlerQueueType.RequestKoreaInvestmentApi,
                            data: {
                                url: '/uapi/domestic-stock/v1/quotations/news-title',
                                tradeId: 'FHKST01011800',
                                params: {
                                    FID_INPUT_DATE_1: `00${koreaInvestmentDate}`,
                                    FID_NEWS_OFER_ENTP_CODE: '',
                                    FID_COND_MRKT_CLS_CODE: '',
                                    FID_INPUT_ISCD: '',
                                    FID_TITL_CNTT: '',
                                    FID_INPUT_HOUR_1: '',
                                    FID_RANK_SORT_CLS_CODE: '',
                                    FID_INPUT_SRNO: '',
                                },
                            } as KoreaInvestmentCallApiParam<DomesticStockQuotationsNewsTitleParam>,
                        },
                    ],
                },
                {
                    queuesOptions: {
                        [CrawlerFlowType.RequestDomesticNewsTitle]: {
                            defaultJobOptions: getDefaultJobOptions(),
                        },
                        [CrawlerQueueType.RequestKoreaInvestmentApi]: {
                            defaultJobOptions: getDefaultJobOptions(),
                        },
                    },
                },
            );
        } catch (error) {
            this.logger.error(error);
        }
    }

    @Cron('*/1 * * * *')
    async handleCrawlingStockPlusNews() {
        try {
            const response = await this.stockPlusClient.getLatestNews();

            await this.stockRepository.setStockPlusNews(
                response.data.breakingNews,
            );
        } catch (error) {
            this.logger.error(error);
        }
    }

    @Cron('*/30 * * * * *')
    async handleCrawlingKoreaInvestmentInvestOpinion() {
        try {
            const currentDate = new Date();
            const koreaInvestmentDate =
                this.koreaInvestmentHelper.formatDateParam(currentDate);

            await this.requestDomesticNewsTitleFlow.add(
                {
                    name: CrawlerFlowType.RequestDomesticNewsTitle,
                    queueName: CrawlerFlowType.RequestDomesticNewsTitle,
                    children: [
                        {
                            name: CrawlerQueueType.RequestKoreaInvestmentApi,
                            queueName:
                                CrawlerQueueType.RequestKoreaInvestmentApi,
                            data: {
                                url: '/uapi/domestic-stock/v1/quotations/news-title',
                                tradeId: 'FHKST01011800',
                                params: {
                                    FID_INPUT_DATE_1: `00${koreaInvestmentDate}`,
                                    FID_NEWS_OFER_ENTP_CODE: '',
                                    FID_COND_MRKT_CLS_CODE: '',
                                    FID_INPUT_ISCD: '',
                                    FID_TITL_CNTT: '',
                                    FID_INPUT_HOUR_1: '',
                                    FID_RANK_SORT_CLS_CODE: '',
                                    FID_INPUT_SRNO: '',
                                },
                            } as KoreaInvestmentCallApiParam<DomesticStockQuotationsNewsTitleParam>,
                        },
                    ],
                },
                {
                    queuesOptions: {
                        [CrawlerFlowType.RequestDomesticNewsTitle]: {
                            defaultJobOptions: getDefaultJobOptions(),
                        },
                        [CrawlerQueueType.RequestKoreaInvestmentApi]: {
                            defaultJobOptions: getDefaultJobOptions(),
                        },
                    },
                },
            );
        } catch (error) {
            this.logger.error(error);
        }
    }
}
