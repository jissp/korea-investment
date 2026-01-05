import * as _ from 'lodash';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { OnQueueProcessor } from '@modules/queue';
import { KoreaInvestmentSettingService } from '@app/modules/korea-investment-setting';
import { KoreaInvestmentRequestApiHelper } from '@app/modules/korea-investment-request-api';
import { NewsRepository } from '@app/modules/repositories/news-repository';
import { KoreaInvestmentNewsToNewsTransformer } from '../transformers/korea-investment-news-to-news.transformer';
import { NewsCrawlerQueueType } from '../news-crawler.types';
import { RequestDomesticNewsTitleResponse } from '../news-crawler.interface';

@Injectable()
export class KoreaInvestmentNewsProcessor {
    private transformer = new KoreaInvestmentNewsToNewsTransformer();

    constructor(
        private readonly koreaInvestmentRequestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly settingService: KoreaInvestmentSettingService,
        private readonly newsRepository: NewsRepository,
    ) {}

    @OnQueueProcessor(NewsCrawlerQueueType.RequestDomesticNewsTitle)
    async processRequestDomesticNewsTitle(job: Job) {
        const childrenResponse =
            await this.koreaInvestmentRequestApiHelper.getChildResponses<
                any,
                RequestDomesticNewsTitleResponse
            >(job);
        const childrenResults = childrenResponse.flatMap(
            ({ response }) => response.output,
        );

        const settingStockCodes = await this.settingService.getStockCodes();
        const stockCodeSet = new Set(settingStockCodes);
        const transformedNewsItems = childrenResults.map((newsItem) =>
            this.transformer.transform(newsItem),
        );
        const chunks = _.chunk(transformedNewsItems, 10);
        for (const chunk of chunks) {
            await Promise.allSettled([
                ...chunk.map((news) => this.newsRepository.addNews(news)),
                ...chunk.flatMap((news) => {
                    // 설정된 종목 코드에 해당하는 종목만 종목 뉴스에 추가합니다.
                    const filteredStockCodes = news.stockCodes.filter(
                        (stockCode) => stockCodeSet.has(stockCode),
                    );

                    return filteredStockCodes.map((stockCode) =>
                        this.newsRepository.addStockNews(stockCode, news),
                    );
                }),
            ]);
        }
    }
}
