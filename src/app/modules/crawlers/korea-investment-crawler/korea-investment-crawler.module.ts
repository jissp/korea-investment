import { Module } from '@nestjs/common';
import { KoreaInvestmentCalendarCrawlerModule } from '@app/modules/crawlers/korea-investment-crawler/korea-investment-calender-crawler';
import { KoreaInvestmentIndexCrawlerModule } from '@app/modules/crawlers/korea-investment-crawler/korea-investment-index-crawler';

const modules = [
    KoreaInvestmentCalendarCrawlerModule,
    KoreaInvestmentIndexCrawlerModule,
];

@Module({
    imports: [...modules],
    exports: [...modules],
})
export class KoreaInvestmentCrawlerModule {}
