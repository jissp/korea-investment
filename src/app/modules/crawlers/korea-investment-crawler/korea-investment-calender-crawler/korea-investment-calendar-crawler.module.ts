import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { KoreaInvestmentAdditionalRequestApiModule } from '@app/modules/korea-investment-request-api/korea-investment-additional-request-api';
import { KoreaInvestmentCalendarModule } from '@app/modules/repositories/korea-investment-calendar';
import { KoreaInvestmentCalendarCrawlerProcessor } from './korea-investment-calendar-crawler.processor';
import KoreaInvestmentCalendarCrawlerSchedule from './korea-investment-calendar-crawler.schedule';
import { KoreaInvestmentCalendarCrawlerFlowType } from './korea-investment-calendar-crawler.types';

const flowTypes = [KoreaInvestmentCalendarCrawlerFlowType.CrawlingCalendar];
const flowProviders = QueueModule.getFlowProviders(flowTypes);

@Module({
    imports: [
        QueueModule.forFeature({
            flowTypes,
        }),
        KoreaInvestmentAdditionalRequestApiModule,
        KoreaInvestmentCalendarModule,
    ],
    providers: [
        ...flowProviders,
        KoreaInvestmentCalendarCrawlerProcessor,
        KoreaInvestmentCalendarCrawlerSchedule,
    ],
})
export class KoreaInvestmentCalendarCrawlerModule {}
