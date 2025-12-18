import { DynamicModule, Module } from '@nestjs/common';
import { RedisModule } from '@modules/redis';
import { KoreaInvestmentWebSocketModule } from '@modules/korea-investment/korea-investment-web-socket';
import { KoreaInvestmentCollectorListener } from './korea-investment-collector.listener';
import { KoreaInvestmentCollectorSocket } from './korea-investment-collector.socket';

@Module({})
export class KoreaInvestmentCollectorModule {
    public static forRoot(): DynamicModule {
        return {
            module: KoreaInvestmentCollectorModule,
            global: true,
            imports: [RedisModule.forFeature(), KoreaInvestmentWebSocketModule],
            providers: [
                KoreaInvestmentCollectorSocket,
                KoreaInvestmentCollectorListener,
            ],
            exports: [KoreaInvestmentCollectorSocket],
        };
    }
}
