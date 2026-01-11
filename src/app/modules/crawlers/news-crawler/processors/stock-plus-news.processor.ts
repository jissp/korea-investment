import { Injectable, Logger } from '@nestjs/common';
import { OnQueueProcessor } from '@modules/queue';
import { NewsService } from '@app/modules/repositories/news';
import { NewsCrawlerQueueType } from '../news-crawler.types';
import {
    StockPlusNewsToNewsTransformer,
    StockPlusNewsTransformResult,
} from '@app/modules/crawlers/news-crawler';
import { StockPlusClient } from '@modules/stock-plus';

@Injectable()
export class StockPlusNewsProcessor {
    private readonly logger = new Logger(StockPlusNewsProcessor.name);
    private readonly transformer = new StockPlusNewsToNewsTransformer();

    constructor(
        private readonly stockPlusClient: StockPlusClient,
        private readonly newsService: NewsService,
    ) {}

    @OnQueueProcessor(NewsCrawlerQueueType.CrawlingStockPlusNews)
    public async processCrawlingNaverNews() {
        const response = await this.stockPlusClient.getLatestNews(20);

        const transformedNewsInfo = response.data.breakingNews.map((news) =>
            this.transformer.transform(news),
        );

        await this.transformWithSave(transformedNewsInfo);
    }

    /**
     *
     * @private
     * @param results
     */
    private async transformWithSave(results: StockPlusNewsTransformResult[]) {
        return Promise.all([
            this.newsService.upsert(results.map(({ news }) => news)),
            this.newsService.upsertStockNews(
                results.flatMap(({ stockCodes, news }) => {
                    return stockCodes.map((stockCode) => ({
                        ...news,
                        stockCode,
                    }));
                }),
            ),
        ]);
    }
}
