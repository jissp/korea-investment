import { Module } from '@nestjs/common';
import { NewsModule } from '@app/modules/news';
import { StockPlusModule } from '@modules/stock-plus';
import { StockPlusNewsCrawlerSchedule } from './stock-plus-news-crawler.schedule';

@Module({
    imports: [StockPlusModule, NewsModule],
    providers: [StockPlusNewsCrawlerSchedule],
})
export class StockPlusNewsCrawlerModule {}
