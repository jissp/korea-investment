import { Module } from '@nestjs/common';
import { KoreaInvestmentAccountCrawlerModule } from './korea-investment-account-crawler';
import { KoreaInvestmentIndexCrawlerModule } from './korea-investment-index-crawler';
import { NewsCrawlerModule } from './news-crawler';
import { StockCrawlerModule } from './stock-crawler';
import { StockRankCrawlerModule } from './stock-rank-crawler';

const modules = [
    KoreaInvestmentAccountCrawlerModule,
    KoreaInvestmentIndexCrawlerModule,
    NewsCrawlerModule,
    StockCrawlerModule,
    StockRankCrawlerModule,
];

@Module({
    imports: [...modules],
    exports: [...modules],
})
export class CrawlerModule {}
