import * as ws from 'ws';
import { Subject } from 'rxjs';
import { Injectable, Logger } from '@nestjs/common';
import { isConnected } from '@common/domains';
import {
    BasePingPongMessage,
    BaseResponse,
    TransformResult,
} from './korea-investment-web-socket.types';
import { KoreaInvestmentWebSocketPipe } from './korea-investment-web-socket.pipe';
import { KoreaInvestmentWebSocketHelperService } from './korea-investment-web-socket.helper.service';

@Injectable()
export class KoreaInvestmentWsFactory {
    constructor(
        private readonly logger: Logger,
        private readonly webSocketHelper: KoreaInvestmentWebSocketHelperService,
        private readonly pipe: KoreaInvestmentWebSocketPipe,
    ) {}

    /**
     * 웹 소켓 생성
     */
    public create() {
        const url = this.webSocketHelper.getWebSocketUrl();
        const koreaInvestmentWs = new ws(url);

        const messageSubject = new Subject<TransformResult>();
        this.setUpWebsocketEvents(koreaInvestmentWs, messageSubject);

        return {
            webSocket: koreaInvestmentWs,
            onMessageObservable: messageSubject.asObservable(),
        };
    }

    /**
     * 웹소켓 이벤트 설정
     * @param webSocket
     * @param messageSubject
     * @private
     */
    private setUpWebsocketEvents(
        webSocket: ws,
        messageSubject: Subject<TransformResult>,
    ) {
        const onMessage = (message: ws.Data) => {
            if (messageSubject.closed) {
                return;
            }

            const encodedMessage = this.convertMessageToString(message);

            if (this.isJson(encodedMessage)) {
                const jsonDecodedMessage = JSON.parse(encodedMessage);

                if (this.isPingPongMessage(jsonDecodedMessage)) {
                    webSocket.pong();
                    return;
                }

                if (this.isSubscribeSuccessMessage(jsonDecodedMessage)) {
                    return;
                }

                return;
            }

            try {
                const transformedData = this.pipe.transform(encodedMessage);
                messageSubject.next(transformedData);
            } catch (error) {
                this.logger.error('Failed to transform message:', error);
            }
        };

        const onClose = () => {
            this.logger.warn('Korea Investment WebSocket closed');

            webSocket.removeAllListeners();
            if (!messageSubject.closed) {
                messageSubject.complete();
            }
        };

        const onError = (error: Error) => {
            this.logger.error(
                `Korea Investment WebSocket error: ${error.message}`,
            );

            if (isConnected(webSocket)) {
                webSocket.close();
                webSocket.removeAllListeners();
            }
            if (!messageSubject.closed) {
                messageSubject.complete();
            }
        };

        webSocket.on('message', onMessage);
        webSocket.on('close', onClose);
        webSocket.on('error', onError);
    }

    /**
     * WebSocket 메시지를 안전하게 문자열로 변환
     * @param message WebSocket에서 받은 메시지 데이터
     * @returns 변환된 문자열
     * @private
     */
    private convertMessageToString(message: ws.Data): string {
        if (typeof message === 'string') {
            return message;
        }

        if (Buffer.isBuffer(message)) {
            return message.toString('utf-8');
        }

        if (message instanceof ArrayBuffer) {
            return Buffer.from(message).toString('utf-8');
        }

        if (Array.isArray(message)) {
            return Buffer.concat(message).toString('utf-8');
        }

        throw new Error(`Unsupported message type: ${typeof message}`);
    }

    /**
     * @param data
     */
    public isJson(data: string) {
        return data.startsWith('{');
    }

    /**
     * @param data
     */
    public isPingPongMessage(data: any): data is BasePingPongMessage {
        return 'header' in data && data.header.tr_id === 'PINGPONG';
    }

    /**
     * @param data
     */
    public isSubscribeSuccessMessage(data: any): data is BaseResponse {
        return 'body' in data && data.body.msg1 === 'SUBSCRIBE SUCCESS';
    }
}
