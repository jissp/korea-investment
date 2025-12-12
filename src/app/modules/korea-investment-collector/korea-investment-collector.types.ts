export enum KoreaInvestmentCollectorEventType {
    /**
     * 소켓 연결 이벤트
     */
    Opened = 'Opened',

    /**
     * 소켓 연결 종료 이벤트
     */
    Closed = 'Closed',

    /**
     * 한국투자증권에서 전달받은 Message
     */
    MessageReceivedFromKoreaInvestment = 'MessageReceivedFromKoreaInvestment',

    /**
     * Gateway에게 전달할 Message
     */
    MessagePublishedToGateway = 'MessagePublishedToGateway',
}
