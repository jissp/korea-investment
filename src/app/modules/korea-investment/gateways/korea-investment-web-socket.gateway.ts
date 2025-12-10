import * as ws from 'ws';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { PreventConcurrentExecution } from '@common/decorators';
import {
    disconnect,
    isConnected,
    isEmptyConnectedSocket,
} from '@common/domains';
import { CustomerType } from '@modules/korea-investment/common';
import {
    KoreaInvestmentWebSocketHelperService,
    KoreaInvestmentWsFactory,
    SubscribeRequest,
    SubscribeType,
    TransformResult,
    WebSocketHeader,
} from '@modules/korea-investment/korea-investment-web-socket';

@WebSocketGateway({
    cors: { origin: '*' },
    transports: ['websocket'],
    namespace: '/ws',
})
export class KoreaInvestmentWebSocketGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    private readonly logger = new Logger(KoreaInvestmentWebSocketGateway.name);

    @WebSocketServer()
    protected server: Server;

    protected koreaInvestmentWs: ws | null = null;

    constructor(
        private readonly helperService: KoreaInvestmentWebSocketHelperService,
        private readonly webSocketFactory: KoreaInvestmentWsFactory,
    ) {}

    /**
     * @param client
     */
    async handleConnection(client: Socket) {
        if (isConnected(this.koreaInvestmentWs)) {
            return;
        }

        await this.connectWs(client);
    }

    /**
     *
     */
    handleDisconnect() {
        if (
            !isConnected(this.koreaInvestmentWs) ||
            !isEmptyConnectedSocket(this.server)
        ) {
            return;
        }

        disconnect(this.koreaInvestmentWs);
        this.koreaInvestmentWs = null;
    }

    @SubscribeMessage('subscribe')
    async handleSubscribe(client: Socket, payload: SubscribeRequest) {
        await this.requestSubscribe(client, SubscribeType.Subscribe, payload);
    }

    @SubscribeMessage('unsubscribe')
    async handleUnsubscribe(client: Socket, payload: SubscribeRequest) {
        await this.requestSubscribe(client, SubscribeType.Unsubscribe, payload);
    }

    /**
     * @private
     */
    @PreventConcurrentExecution()
    private async connectWs(client: Socket) {
        try {
            const connection = this.webSocketFactory.create();
            connection.onMessageObservable.subscribe((message) =>
                this.handleOnMessage(message),
            );

            this.koreaInvestmentWs = connection.webSocket;
        } catch (error) {
            this.logger.error(
                `Failed to connect to Korea Investment WebSocket: ${error}`,
            );

            client.emit('error', {
                message: 'Failed to connect to Korea Investment WebSocket',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    /**
     * @param client
     * @param requestType
     * @param payload
     * @private
     */
    private async requestSubscribe(
        client: Socket,
        requestType: SubscribeType,
        payload: SubscribeRequest,
    ) {
        try {
            if (!isConnected(this.koreaInvestmentWs)) {
                throw new Error('Korea Investment WebSocket is not connected');
            }

            const approvalKey = await this.helperService.getWebSocketToken();
            const message = JSON.stringify({
                header: this.buildSubscribeHeader(requestType, approvalKey),
                body: {
                    input: payload,
                },
            });

            this.koreaInvestmentWs.send(message);
        } catch (error) {
            this.logger.error(`Subscribe error: ${error}`);

            client.emit('error', {
                message: 'Failed to subscribe',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    /**
     * @param requestType
     * @param approvalKey
     * @private
     */
    private buildSubscribeHeader(
        requestType: SubscribeType,
        approvalKey: string,
    ): WebSocketHeader {
        return {
            approval_key: approvalKey,
            tr_type: requestType,
            custtype: CustomerType.Personal,
            content_type: 'utf-8',
        };
    }

    /**
     * @param tradeId
     * @param records
     * @private
     */
    private handleOnMessage({ tradeId, records }: TransformResult) {
        if (!isConnected(this.koreaInvestmentWs)) {
            return;
        }

        for (const record of records) {
            const pipe = this.helperService.getPipe(tradeId);
            const realtimeData = pipe.transform(record);

            this.server.emit('realtime-data', realtimeData);
        }
    }
}
