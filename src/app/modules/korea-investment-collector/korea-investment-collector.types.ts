import { SubscribeType } from '@modules/korea-investment/korea-investment-web-socket';

export enum KoreaInvestmentCollectorQueueType {
    RequestRealTimeData = 'RequestRealTimeData',
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
