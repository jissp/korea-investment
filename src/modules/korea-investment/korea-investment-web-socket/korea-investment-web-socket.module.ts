import { Module } from '@nestjs/common';
import { KoreaInvestmentConfigModule } from '@modules/korea-investment/korea-investment-config';
import { KoreaInvestmentHelperModule } from '@modules/korea-investment/korea-investment-helper';
import {
    koreaInvestmentWebSocketPipeMap,
    koreaInvestmentWebSocketPipeMapProvider,
} from './korea-investment-web-socket.config';
import { KoreaInvestmentWsFactory } from './korea-investment-ws.factory';
import { KoreaInvestmentWebSocketHelperService } from './korea-investment-web-socket.helper.service';
import { KoreaInvestmentWebSocketPipe } from './korea-investment-web-socket.pipe';

@Module({
    imports: [KoreaInvestmentConfigModule, KoreaInvestmentHelperModule],
    providers: [
        {
            provide: koreaInvestmentWebSocketPipeMapProvider,
            useValue: koreaInvestmentWebSocketPipeMap,
        },
        KoreaInvestmentWsFactory,
        KoreaInvestmentWebSocketHelperService,
        KoreaInvestmentWebSocketPipe,
    ],
    exports: [
        KoreaInvestmentWsFactory,
        KoreaInvestmentWebSocketHelperService,
        KoreaInvestmentWebSocketPipe,
    ],
})
export class KoreaInvestmentWebSocketModule {}
