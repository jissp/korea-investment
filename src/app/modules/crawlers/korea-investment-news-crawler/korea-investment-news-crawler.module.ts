import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { KoreaInvestmentHelperModule } from '@modules/korea-investment/korea-investment-helper';
import { KoreaInvestmentRequestApiModule } from '@app/modules/korea-investment-request-api';
import { KoreaInvestmentSettingModule } from '@app/modules/korea-investment-setting';
import { NewsModule } from '@app/modules/news';
import { KoreaInvestmentNewsCrawlerType } from './korea-investment-news-crawler.types';
import { KoreaInvestmentNewsCrawlerProcessor } from './korea-investment-news-crawler.processor';
import { KoreaInvestmentNewsCrawlerSchedule } from './korea-investment-news-crawler.schedule';

const flowTypes = [KoreaInvestmentNewsCrawlerType.RequestDomesticNewsTitle];
const flowProviders = QueueModule.getFlowProviders(flowTypes);

@Module({
    imports: [
        QueueModule.forFeature({
            flowTypes,
        }),
        KoreaInvestmentHelperModule,
        KoreaInvestmentRequestApiModule,
        KoreaInvestmentSettingModule,
        NewsModule,
    ],
    providers: [
        ...flowProviders,
        KoreaInvestmentNewsCrawlerProcessor,
        KoreaInvestmentNewsCrawlerSchedule,
    ],
    exports: [],
})
export class KoreaInvestmentNewsCrawlerModule {}
