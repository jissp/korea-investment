import { Module } from '@nestjs/common';
import { KoreaInvestmentCrawlerModule } from './korea-investment-crawler/korea-investment-crawler.module';
import { KoreaInvestmentAccountCrawlerModule } from './korea-investment-crawler/korea-investment-account-crawler';
import { NewsCrawlerModule } from './news-crawler';
import { StockCrawlerModule } from './stock-crawler';
import { StockRankCrawlerModule } from './stock-rank-crawler';

const modules = [
    KoreaInvestmentCrawlerModule,
    KoreaInvestmentAccountCrawlerModule,
    NewsCrawlerModule,
    StockCrawlerModule,
    StockRankCrawlerModule,
];

@Module({
    imports: [...modules],
    exports: [...modules],
})
export class CrawlerModule {}
