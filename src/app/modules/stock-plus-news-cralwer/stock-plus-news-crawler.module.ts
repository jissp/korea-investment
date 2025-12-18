import { Module } from '@nestjs/common';
import { StockRepositoryModule } from '@app/modules/stock-repository';
import { StockPlusModule } from '@modules/stock-plus';
import { StockPlusNewsCrawlerSchedule } from './stock-plus-news-crawler.schedule';

@Module({
    imports: [StockRepositoryModule, StockPlusModule],
    providers: [StockPlusNewsCrawlerSchedule],
})
export class StockPlusNewsCrawlerModule {}