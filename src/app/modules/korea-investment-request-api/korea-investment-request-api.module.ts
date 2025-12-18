import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { KoreaInvestmentHelperModule } from '@modules/korea-investment/korea-investment-helper';
import { KoreaInvestmentRequestApiType } from './korea-investment-request-api.type';
import { KoreaInvestmentRequestApiHelper } from './korea-investment-request-api.helper';
import { KoreaInvestmentRequestApiProcessor } from './korea-investment-request-api.processor';

const queueTypes = [KoreaInvestmentRequestApiType];
const queueProviders = QueueModule.getQueueProviders(queueTypes);

@Module({
    imports: [
        QueueModule.forFeature({
            queueTypes,
        }),
        KoreaInvestmentHelperModule,
    ],
    providers: [
        ...queueProviders,
        KoreaInvestmentRequestApiProcessor,
        KoreaInvestmentRequestApiHelper,
    ],
    exports: [...queueProviders, KoreaInvestmentRequestApiHelper],
})
export class KoreaInvestmentRequestApiModule {}
