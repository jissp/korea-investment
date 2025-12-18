import * as ws from 'ws';
import { Subscription } from 'rxjs';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { isConnected } from '@common/domains';
import { CustomerType } from '@modules/korea-investment/common';
import {
    KoreaInvestmentWebSocketHelperService,
    KoreaInvestmentWsFactory,
    SubscribeRequest,
    SubscribeType,
    WebSocketHeader,
} from '@modules/korea-investment/korea-investment-web-socket';
import { KoreaInvestmentCollectorEventType } from './korea-investment-collector.types';

@Injectable()
export class KoreaInvestmentCollectorSocket implements OnModuleInit {
    private socket: ws;
    private messageSubscription: Subscription | null = null;

    constructor(
        private readonly helperService: KoreaInvestmentWebSocketHelperService,
        private readonly factory: KoreaInvestmentWsFactory,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async onModuleInit() {
        await this.connect();
    }

    /**
     * socket이 연결중인지 확인합니다.
     */
    public isConnected() {
        return isConnected(this.socket);
    }

    /**
     * socket을 연결합니다.
     */
    public async connect() {
        if (isConnected(this.socket)) {
            return;
        }

        const { webSocket, onMessageObservable } = this.factory.create();
        webSocket.on('open', () =>
            this.eventEmitter.emit(KoreaInvestmentCollectorEventType.Opened),
        );
        webSocket.on('close', () =>
            this.eventEmitter.emit(KoreaInvestmentCollectorEventType.Closed),
        );

        this.socket = webSocket;
        this.messageSubscription = onMessageObservable.subscribe((message) => {
            this.eventEmitter.emit(
                KoreaInvestmentCollectorEventType.MessageReceivedFromKoreaInvestment,
                message,
            );
        });
    }

    /**
     * socket을 닫습니다.
     */
    public disconnect() {
        if (!this.isConnected()) {
            return;
        }

        this.messageSubscription?.unsubscribe();
        this.messageSubscription = null;

        this.socket.close();
    }

    /**
     * socket을 재연결합니다.
     */
    public async reconnect() {
        this.disconnect();
        await this.connect();
    }

    /**
     * socket을 통해 메세지를 전송합니다.
     * @param message
     */
    public send<T>(message: T) {
        this.socket.send(JSON.stringify(message));
    }

    /**
     * Korea Investment Web Socket을 통해 구독을 요청합니다.
     * @param payload
     */
    public async subscribe(payload: SubscribeRequest) {
        const approvalKey = await this.helperService.getWebSocketToken();
        const message = {
            header: this.buildSubscribeHeader(
                SubscribeType.Subscribe,
                approvalKey,
            ),
            body: {
                input: payload,
            },
        };

        this.send(message);
    }

    /**
     * Korea Investment Web Socket을 통해 구독을 취소합니다.
     * @param payload
     */
    public async unsubscribe(payload: SubscribeRequest) {
        const approvalKey = await this.helperService.getWebSocketToken();
        const message = {
            header: this.buildSubscribeHeader(
                SubscribeType.Unsubscribe,
                approvalKey,
            ),
            body: {
                input: payload,
            },
        };

        this.send(message);
    }

    /**
     * Korea Investment Web Socket 요청 헤더를 생성합니다.
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
}
