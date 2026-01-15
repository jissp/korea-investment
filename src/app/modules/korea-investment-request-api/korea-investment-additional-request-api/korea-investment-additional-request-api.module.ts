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
import { KoreaInvestmentAdditionalRequestApiProcessor } from './korea-investment-additional-request-api.processor';

const queueTypes = [KoreaInvestmentRequestApiType.Additional];
const queueProviders = QueueModule.getQueueProviders(queueTypes);

@Module({
    imports: [
        QueueModule.forFeature({
            queueTypes,
        }),
        KoreaInvestmentHelperModule.forFeature(CredentialType.Additional),
    ],
    providers: [
        ...queueProviders,
        KoreaInvestmentAdditionalRequestApiProcessor,
        KoreaInvestmentRequestApiHelper,
    ],
    exports: [...queueProviders, KoreaInvestmentRequestApiHelper],
})
export class KoreaInvestmentAdditionalRequestApiModule {}
