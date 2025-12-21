import * as ws from 'ws';
import { Subscription } from 'rxjs';
import { Queue } from 'bullmq';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { isConnected } from '@common/domains';
import {
    KoreaInvestmentWsFactory,
    SubscribeType,
} from '@modules/korea-investment/korea-investment-web-socket';
import {
    KoreaInvestmentCollectorEventType,
    KoreaInvestmentCollectorQueueType,
    KoreaInvestmentRequestRealTimeJobPayload,
} from './korea-investment-collector.types';

@Injectable()
export class KoreaInvestmentCollectorSocket implements OnModuleInit {
    private socket: ws;
    private messageSubscription: Subscription | null = null;

    constructor(
        private readonly factory: KoreaInvestmentWsFactory,
        private readonly eventEmitter: EventEmitter2,
        @Inject(KoreaInvestmentCollectorQueueType.RequestRealTimeData)
        private readonly queue: Queue<KoreaInvestmentRequestRealTimeJobPayload>,
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
        // TODO 추후 기존 구독 내역을 자동으로 복원할 수 있어야 한다. RedisSet을 통해서 구현하는게 쉬울지도.
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
     * 구독 요청 Job을 생성합니다.
     * @param stockCode
     */
    public async subscribe(stockCode: string) {
        return this.queue.add(
            KoreaInvestmentCollectorQueueType.RequestRealTimeData,
            {
                subscribeType: SubscribeType.Subscribe,
                stockCode,
            },
        );
    }

    /**
     * 구독 해제 요청 Job을 생성합니다.
     * @param stockCode
     */
    public async unsubscribe(stockCode: string) {
        return this.queue.add(
            KoreaInvestmentCollectorQueueType.RequestRealTimeData,
            {
                subscribeType: SubscribeType.Unsubscribe,
                stockCode,
            },
        );
    }
}
