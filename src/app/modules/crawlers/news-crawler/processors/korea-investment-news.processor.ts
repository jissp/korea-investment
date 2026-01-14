import * as _ from 'lodash';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { OnQueueProcessor } from '@modules/queue';
import { KoreaInvestmentRequestApiHelper } from '@app/modules/korea-investment-request-api/common';
import { FavoriteStockService } from '@app/modules/repositories/favorite-stock';
import { NewsService } from '@app/modules/repositories/news';
import { KoreaInvestmentNewsToNewsTransformer } from '../transformers/korea-investment-news-to-news.transformer';
import { NewsCrawlerQueueType } from '../news-crawler.types';
import { RequestDomesticNewsTitleResponse } from '../news-crawler.interface';

@Injectable()
export class KoreaInvestmentNewsProcessor {
    private transformer = new KoreaInvestmentNewsToNewsTransformer();

    constructor(
        private readonly koreaInvestmentRequestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly newsService: NewsService,
        private readonly favoriteStockService: FavoriteStockService,
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

        const favoriteStocks = await this.favoriteStockService.findAll();
        const stockCodes = favoriteStocks.map(({ stockCode }) => stockCode);
        const stockCodeSet = new Set(stockCodes);

        const transformedNewsItems = childrenResults.map((newsItem) =>
            this.transformer.transform(newsItem),
        );
        const chunks = _.chunk(transformedNewsItems, 10);
        for (const chunk of chunks) {
            await Promise.allSettled([
                this.newsService.upsert(chunk.map(({ news }) => news)),
                ...chunk.flatMap((newsItem) => {
                    // 설정된 종목 코드에 해당하는 종목만 종목 뉴스에 추가합니다.
                    const filteredStockCodes = newsItem.stockCodes.filter(
                        (stockCode) => stockCodeSet.has(stockCode),
                    );

                    return filteredStockCodes.map((stockCode) =>
                        this.newsService.upsertStockNews({
                            ...newsItem.news,
                            stockCode,
                        }),
                    );
                }),
            ]);
        }
    }
}
