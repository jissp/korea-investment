import { Module } from '@nestjs/common';
import { KoreaInvestmentHolidayCrawlerModule } from '@app/modules/crawlers/korea-investment-crawler/korea-investment-holiday-crawler';
import { KoreaInvestmentIndexCrawlerModule } from '@app/modules/crawlers/korea-investment-crawler/korea-investment-index-crawler';

const modules = [
    KoreaInvestmentHolidayCrawlerModule,
    KoreaInvestmentIndexCrawlerModule,
];

@Module({
    imports: [...modules],
    exports: [...modules],
})
export class KoreaInvestmentCrawlerModule {}
