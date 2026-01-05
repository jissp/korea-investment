import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { OnEvent } from '@nestjs/event-emitter';
import { KoreaInvestmentCollectorEventType } from '@app/modules/korea-investment-collector';

@WebSocketGateway({
    cors: { origin: '*' },
    transports: ['websocket'],
    namespace: '/ws',
})
export class KoreaInvestmentBeGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    protected server: Server;

    constructor(private readonly logger: Logger) {}

    /**
     * @param client
     */
    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    /**
     * @param client
     */
    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    /**
     * @param message
     */
    @OnEvent(KoreaInvestmentCollectorEventType.MessagePublishedToGateway)
    public onMessage(message: { tradeId: string; record: unknown }) {
        this.server.emit('realtime-data', message);
    }
}
