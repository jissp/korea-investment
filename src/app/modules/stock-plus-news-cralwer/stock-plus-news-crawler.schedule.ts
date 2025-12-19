import * as _ from 'lodash';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NewsService } from '@app/modules/news';
import { StockPlusClient } from '@modules/stock-plus';
import { StockPlusNewsToNewsTransformer } from './stock-plus-news-to-news.transformer';

@Injectable()
export class StockPlusNewsCrawlerSchedule implements OnModuleInit {
    private readonly logger = new Logger(StockPlusNewsCrawlerSchedule.name);
    private readonly transformer = new StockPlusNewsToNewsTransformer();

    constructor(
        private readonly stockPlusClient: StockPlusClient,
        private readonly newsService: NewsService,
    ) {}

    onModuleInit() {
        this.handleCrawlingStockPlusNews();
    }

    @Cron('*/30 * * * * *')
    async handleCrawlingStockPlusNews() {
        try {
            const response = await this.stockPlusClient.getLatestNews();

            const transformedNews = response.data.breakingNews.map(
                (stockPlusNews) => this.transformer.transform(stockPlusNews),
            );

            const chunks = _.chunk(transformedNews, 10);
            for (const chunk of chunks) {
                await Promise.allSettled(
                    chunk.map((news) => this.newsService.addNews(news)),
                );
            }
        } catch (error) {
            this.logger.error(error);
        }
    }
}
