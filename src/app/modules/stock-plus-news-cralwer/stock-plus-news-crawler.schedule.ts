import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { StockPlusClient } from '@modules/stock-plus';
import { StockRepository } from '@app/modules/stock-repository';

@Injectable()
export class StockPlusNewsCrawlerSchedule implements OnModuleInit {
    private readonly logger = new Logger(StockPlusNewsCrawlerSchedule.name);

    constructor(
        private readonly stockPlusClient: StockPlusClient,
        private readonly stockRepository: StockRepository,
    ) {}

    onModuleInit() {
        this.handleCrawlingStockPlusNews();
    }

    @Cron('*/30 * * * * *')
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
}
