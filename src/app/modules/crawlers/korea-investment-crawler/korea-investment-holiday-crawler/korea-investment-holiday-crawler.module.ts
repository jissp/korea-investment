import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import {
    CredentialType,
    KoreaInvestmentHelperModule,
} from '@modules/korea-investment/korea-investment-helper';
import { KoreaInvestmentAdditionalRequestApiModule } from '@app/modules/korea-investment-request-api/korea-investment-additional-request-api';
import { KoreaInvestmentHolidayModule } from '@app/modules/repositories/korea-investment-holiday';
import { KoreaInvestmentHolidayCrawlerProcessor } from './korea-investment-holiday-crawler.processor';
import KoreaInvestmentHolidayCrawlerSchedule from './korea-investment-holiday-crawler.schedule';
import { KoreaInvestmentHolidayCrawlerFlowType } from './korea-investment-holiday-crawler.types';

const flowTypes = [KoreaInvestmentHolidayCrawlerFlowType.CrawlingHoliday];
const flowProviders = QueueModule.getFlowProviders(flowTypes);

@Module({
    imports: [
        QueueModule.forFeature({
            flowTypes,
        }),
        KoreaInvestmentHelperModule.forFeature(CredentialType.Additional),
        KoreaInvestmentAdditionalRequestApiModule,
        KoreaInvestmentHolidayModule,
    ],
    providers: [
        ...flowProviders,
        KoreaInvestmentHolidayCrawlerProcessor,
        KoreaInvestmentHolidayCrawlerSchedule,
    ],
})
export class KoreaInvestmentHolidayCrawlerModule {}
