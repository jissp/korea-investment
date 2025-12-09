import { Logger, Module } from '@nestjs/common';
import { KoreaInvestmentConfigModule } from '@modules/korea-investment/korea-investment-config';
import { KoreaInvestmentHelperModule } from '@modules/korea-investment/korea-investment-helper';
import {
    koreaInvestmentWebSocketPipeMap,
    koreaInvestmentWebSocketPipeMapProvider,
} from './korea-investment-web-socket.config';
import { KoreaInvestmentWebSocketHelperService } from './korea-investment-web-socket.helper.service';
import { KoreaInvestmentWebSocketPipe } from './korea-investment-web-socket.pipe';
import { KoreaInvestmentWsFactory } from './korea-investment-ws.factory';

@Module({
    imports: [KoreaInvestmentConfigModule, KoreaInvestmentHelperModule],
    providers: [
        {
            provide: Logger,
            useValue: new Logger(KoreaInvestmentWebSocketModule.name),
        },
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
