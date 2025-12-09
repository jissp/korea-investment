import { Pipe } from '@common/types';
import {
    H0nxasp0Pipe,
    H0nxcnt0Pipe,
    H0stasp0Pipe,
    H0stcnt0Pipe,
    H0unasp0Pipe,
    H0uncnt0Pipe,
    Hdfsasp0Pipe,
} from './pipes';

export const koreaInvestmentWebSocketPipeMapProvider =
    'koreaInvestmentWebSocketPipeMap';

export const koreaInvestmentWebSocketPipeMap: Map<
    string,
    Pipe<string[], any>
> = new Map(
    Object.entries({
        H0NXASP0: new H0nxasp0Pipe(),
        H0NXCNT0: new H0nxcnt0Pipe(),
        H0STASP0: new H0stasp0Pipe(),
        H0STCNT0: new H0stcnt0Pipe(),
        H0UNASP0: new H0unasp0Pipe(),
        H0UNCNT0: new H0uncnt0Pipe(),
        HDFSASP0: new Hdfsasp0Pipe(),
    }),
);
