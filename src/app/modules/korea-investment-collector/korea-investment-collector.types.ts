import { SubscribeType } from '@modules/korea-investment/korea-investment-web-socket/korea-investment-web-socket.types';

export enum KoreaInvestmentCollectorQueueType {
    SubscribeStock = 'SubscribeStock',
}

export interface KoreaInvestmentRequestRealTimeJobPayload {
    stockCode: string;
    subscribeType: SubscribeType;
}

export enum KoreaInvestmentCollectorEventType {
    /**
     * 한국투자증권에서 전달받은 Message
     */
    MessageReceivedFromKoreaInvestment = 'MessageReceivedFromKoreaInvestment',

    /**
     * Gateway에게 전달할 Message
     */
    MessagePublishedToGateway = 'MessagePublishedToGateway',
}
