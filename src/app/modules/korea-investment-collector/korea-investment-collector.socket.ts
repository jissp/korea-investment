import * as ws from 'ws';
import { Subscription } from 'rxjs';
import { Queue } from 'bullmq';
import {
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { sleep } from '@common/utils';
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
import { Nullable } from '@common/types';

@Injectable()
export class KoreaInvestmentCollectorSocket {
    private socket: Nullable<ws> = null;
    private messageSubscription: Nullable<Subscription> = null;

    constructor(
        private readonly factory: KoreaInvestmentWsFactory,
        private readonly eventEmitter: EventEmitter2,
        @Inject(KoreaInvestmentCollectorQueueType.SubscribeStock)
        private readonly queue: Queue<KoreaInvestmentRequestRealTimeJobPayload>,
    ) {}

    /**
     * socket이 연결중인지 확인합니다.
     */
    public isConnected(): boolean {
        return isConnected(this.socket);
    }

    /**
     * socket을 연결합니다.
     */
    public async connect() {
        if (isConnected(this.socket)) {
            return this.socket;
        }

        const { webSocket, onMessageObservable } = this.factory.create();

        return new Promise<ws>((resolve, reject) => {
            webSocket.on('open', () => resolve(webSocket));
            webSocket.on('error', (ws: WebSocket, error: Error) =>
                reject(error),
            );

            this.messageSubscription = onMessageObservable.subscribe(
                (message) => {
                    this.eventEmitter.emit(
                        KoreaInvestmentCollectorEventType.MessageReceivedFromKoreaInvestment,
                        message,
                    );
                },
            );

            this.socket = webSocket;
        });
    }

    /**
     * socket을 닫습니다.
     */
    public async disconnect() {
        try {
            if (!this.isConnected()) {
                return;
            }

            this.messageSubscription?.unsubscribe();
            this.messageSubscription = null;

            this.socket?.close();
            this.socket = null;

            await sleep(500);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }

            throw new InternalServerErrorException('Unknown error occurred');
        }
    }

    /**
     * socket을 재연결합니다.
     */
    public async reconnect() {
        await this.disconnect();
        await this.connect();
    }

    /**
     * socket을 통해 메세지를 전송합니다.
     * @param message
     */
    public async send<T>(message: T) {
        if (!this.isConnected()) {
            await this.reconnect();
        }

        if (this.isConnected()) {
            this.socket?.send(JSON.stringify(message));
        }
    }

    /**
     * 구독 요청 Job을 생성합니다.
     * @param stockCode
     */
    public async subscribe(stockCode: string) {
        return this.queue.add(
            KoreaInvestmentCollectorQueueType.SubscribeStock,
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
            KoreaInvestmentCollectorQueueType.SubscribeStock,
            {
                subscribeType: SubscribeType.Unsubscribe,
                stockCode,
            },
        );
    }
}
