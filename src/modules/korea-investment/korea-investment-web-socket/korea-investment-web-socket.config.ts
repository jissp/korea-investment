import { Pipe } from '@common/types';
import { H0unasp0Pipe, TradeStreamPipe, H0unpgm0Pipe } from './pipes';

export const koreaInvestmentWebSocketPipeMapProvider =
    'koreaInvestmentWebSocketPipeMap';

export const koreaInvestmentWebSocketPipeMap: Map<
    string,
    Pipe<string[], any>
> = new Map(
    Object.entries({
        H0UNASP0: new H0unasp0Pipe(),
        H0UNCNT0: new TradeStreamPipe(),
        H0STCNT0: new TradeStreamPipe(),
        H0UNPGM0: new H0unpgm0Pipe(),
    }),
);
