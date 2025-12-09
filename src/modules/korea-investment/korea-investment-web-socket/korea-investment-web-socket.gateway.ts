import { Server, Socket } from 'socket.io';
import * as ws from 'ws';
import { Logger } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { PreventConcurrentExecution } from '@common/decorators';
import { CustomerType } from '@modules/korea-investment/common';
import { KoreaInvestmentHelperService } from '@modules/korea-investment/korea-investment-helper';
import {
    SubscribeRequest,
    SubscribeType,
    WebSocketHeader,
} from './korea-investment-web-socket.types';
import { KoreaInvestmentWsFactory } from './korea-investment-ws.factory';
import { KoreaInvestmentWebSocketPipe } from './korea-investment-web-socket.pipe';
import { KoreaInvestmentWebSocketHelperService } from './korea-investment-web-socket.helper.service';

@WebSocketGateway({
    cors: { origin: '*' },
    transports: ['websocket'],
    namespace: '/ws',
})
export class KoreaInvestmentWebSocketGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    protected server: Server;

    private pipe = new KoreaInvestmentWebSocketPipe();
    protected koreaInvestmentWs: ws | null = null;

    constructor(
        private readonly logger: Logger,
        private readonly helperService: KoreaInvestmentHelperService,
        private readonly webSocketHelperService: KoreaInvestmentWebSocketHelperService,
        private readonly webSocketFactory: KoreaInvestmentWsFactory,
    ) {}

    /**
     * @param client
     */
    async handleConnection(client: Socket) {
        if (this.isConnected()) {
            return;
        }

        await this.connectWs(client);
    }

    /**
     *
     */
    handleDisconnect() {
        if (!this.isConnected() || !this.isEmptyConnectedSocket()) {
            return;
        }

        this.disconnectWs();
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
     * @private
     */
    private disconnectWs() {
        if (!this.koreaInvestmentWs) {
            return;
        }

        this.koreaInvestmentWs.removeAllListeners();
        this.koreaInvestmentWs.close();
        this.koreaInvestmentWs = null;
    }

    /**
     * @private
     */
    private isConnected(): this is { koreaInvestmentWs: ws } {
        return (
            !isNil(this.koreaInvestmentWs) &&
            this.koreaInvestmentWs.readyState === WebSocket.OPEN
        );
    }

    /**
     * @private
     */
    private isEmptyConnectedSocket() {
        return this.server.sockets.sockets?.size === 0;
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
            if (!this.isConnected()) {
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
     * @param message
     * @private
     */
    private handleOnMessage(message: string) {
        if (!this.isConnected()) {
            return;
        }

        const { tradeId, records } = this.pipe.transform(message);
        for (const record of records) {
            const pipe = this.webSocketHelperService.getPipe(tradeId);
            const realtimeData = pipe.transform(record);

            this.server.emit('realtime-data', realtimeData);
        }
    }
}
