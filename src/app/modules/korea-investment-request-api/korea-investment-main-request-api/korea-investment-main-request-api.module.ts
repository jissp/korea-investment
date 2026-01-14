import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import {
    CredentialType,
    KoreaInvestmentHelperModule,
} from '@modules/korea-investment/korea-investment-helper';
import {
    KoreaInvestmentRequestApiHelper,
    KoreaInvestmentRequestApiType,
} from '@app/modules/korea-investment-request-api/common';
import { KoreaInvestmentMainRequestApiProcessor } from './korea-investment-main-request-api.processor';
import { KoreaInvestmentMainRequestApiService } from './korea-investment-main-request-api.service';

const queueTypes = [KoreaInvestmentRequestApiType.Main];
const queueProviders = QueueModule.getQueueProviders(queueTypes);

@Module({
    imports: [
        QueueModule.forFeature({
            queueTypes,
        }),
        KoreaInvestmentHelperModule.forFeature(CredentialType.Main),
    ],
    providers: [
        ...queueProviders,
        KoreaInvestmentMainRequestApiProcessor,
        KoreaInvestmentMainRequestApiService,
        KoreaInvestmentRequestApiHelper,
    ],
    exports: [
        ...queueProviders,
        KoreaInvestmentMainRequestApiService,
        KoreaInvestmentRequestApiHelper,
    ],
})
export class KoreaInvestmentMainRequestApiModule {}
