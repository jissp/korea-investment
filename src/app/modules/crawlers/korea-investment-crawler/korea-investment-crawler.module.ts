import { Module } from '@nestjs/common';
import { KoreaInvestmentCalendarCrawlerModule } from '@app/modules/crawlers/korea-investment-crawler/korea-investment-calender-crawler';
import { KoreaInvestmentIndexCrawlerModule } from '@app/modules/crawlers/korea-investment-crawler/korea-investment-index-crawler';
import { KoreaInvestmentAccountCrawlerModule } from '@app/modules/crawlers/korea-investment-crawler/korea-investment-account-crawler';

const modules = [
    KoreaInvestmentCalendarCrawlerModule,
    KoreaInvestmentIndexCrawlerModule,
    KoreaInvestmentAccountCrawlerModule,
];

@Module({
    imports: [...modules],
    exports: [...modules],
})
export class KoreaInvestmentCrawlerModule {}
