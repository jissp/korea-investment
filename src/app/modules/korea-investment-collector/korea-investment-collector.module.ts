import { DynamicModule, Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { RedisModule } from '@modules/redis';
import { KoreaInvestmentWebSocketModule } from '@modules/korea-investment/korea-investment-web-socket';
import { KoreaInvestmentCollectorQueueType } from './korea-investment-collector.types';
import { KoreaInvestmentCollectorListener } from './korea-investment-collector.listener';
import { KoreaInvestmentCollectorProcessor } from './korea-investment-collector.processor';
import { KoreaInvestmentCollectorSocket } from './korea-investment-collector.socket';

const queueTypes = [KoreaInvestmentCollectorQueueType.RequestRealityData];
const queueProviders = QueueModule.getQueueProviders(queueTypes);

@Module({})
export class KoreaInvestmentCollectorModule {
    public static forRoot(): DynamicModule {
        return {
            module: KoreaInvestmentCollectorModule,
            global: true,
            imports: [
                QueueModule.forFeature({
                    queueTypes,
                }),
                RedisModule.forFeature(),
                KoreaInvestmentWebSocketModule,
            ],
            providers: [
                KoreaInvestmentCollectorSocket,
                KoreaInvestmentCollectorListener,
                KoreaInvestmentCollectorProcessor,
                ...queueProviders,
            ],
            exports: [KoreaInvestmentCollectorSocket],
        };
    }
}
