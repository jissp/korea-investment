import * as _ from 'lodash';
import { FlowProducer } from 'bullmq';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { getDefaultJobOptions } from '@modules/queue';
import { KoreaInvestmentHelperService } from '@modules/korea-investment/korea-investment-helper';
import { DomesticStockQuotationsNewsTitleParam } from '@modules/korea-investment/korea-investment-quotation-client';
import {
    KoreaInvestmentSettingHelperService,
    KoreaInvestmentSettingKey,
} from '@app/modules/korea-investment-setting';
import {
    KoreaInvestmentRequestApiHelper,
    KoreaInvestmentRequestApiType,
} from '@app/modules/korea-investment-request-api';
import { KoreaInvestmentNewsCrawlerType } from './korea-investment-news-crawler.types';

@Injectable()
export class KoreaInvestmentNewsCrawlerSchedule implements OnModuleInit {
    private readonly logger = new Logger(
        KoreaInvestmentNewsCrawlerSchedule.name,
    );

    constructor(
        private readonly koreaInvestmentHelper: KoreaInvestmentHelperService,
        private readonly requestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly koreaInvestmentSettingHelperService: KoreaInvestmentSettingHelperService,
        @Inject(KoreaInvestmentNewsCrawlerType.RequestDomesticNewsTitle)
        private readonly requestDomesticNewsTitleFlow: FlowProducer,
    ) {}

    onModuleInit() {
        this.handleCrawlingKoreaInvestmentNewsByStockCode();
    }

    @Cron('*/1 * * * *')
    async handleCrawlingKoreaInvestmentNewsByStockCode() {
        try {
            const stockCodes = await this.koreaInvestmentSettingHelperService
                .getSettingSet(KoreaInvestmentSettingKey.StockCodes)
                .list();
            if (!stockCodes.length) {
                return;
            }

            const startDate = this.koreaInvestmentHelper.formatDateParam(
                new Date(),
            );

            const queueName =
                KoreaInvestmentNewsCrawlerType.RequestDomesticNewsTitle;
            const queuesOption = {
                defaultJobOptions: getDefaultJobOptions(),
            };

            const stockCodesChunk = _.chunk(stockCodes, 5);

            for (const chunk of stockCodesChunk) {
                await Promise.allSettled(
                    chunk.map((stockCode) => {
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
                                    [KoreaInvestmentNewsCrawlerType.RequestDomesticNewsTitle]:
                                        queuesOption,
                                    [KoreaInvestmentRequestApiType]:
                                        queuesOption,
                                },
                            },
                        );
                    }),
                );
            }
        } catch (error) {
            this.logger.error(error);
        }
    }

    private buildRequestApiChildren(startDate: string, stockCode: string) {
        return this.requestApiHelper.generateRequestApi<DomesticStockQuotationsNewsTitleParam>(
            {
                url: '/uapi/domestic-stock/v1/quotations/news-title',
                tradeId: 'FHKST01011800',
                params: {
                    FID_INPUT_DATE_1: `00${startDate}`,
                    FID_NEWS_OFER_ENTP_CODE: '',
                    FID_COND_MRKT_CLS_CODE: '',
                    FID_INPUT_ISCD: stockCode,
                    FID_TITL_CNTT: '',
                    FID_INPUT_HOUR_1: '',
                    FID_RANK_SORT_CLS_CODE: '',
                    FID_INPUT_SRNO: '',
                },
            },
        );
    }
}
