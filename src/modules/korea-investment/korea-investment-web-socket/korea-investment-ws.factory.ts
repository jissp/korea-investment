import * as ws from 'ws';
import { Subject } from 'rxjs';
import { Injectable, Logger } from '@nestjs/common';
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

    private setUpWebsocketEvents(
        webSocket: ws,
        messageSubject: Subject<TransformResult>,
    ) {
        const onMessage = (message: ws.Data) => {
            const encodedMessage = message.toString('utf-8');

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
            messageSubject.complete();
        };

        const onError = (error: Error) => {
            this.logger.error(
                `Korea Investment WebSocket error: ${error.message}`,
            );
            messageSubject.error(error);
            messageSubject.unsubscribe();
        };

        webSocket.on('message', onMessage);
        webSocket.on('close', onClose);
        webSocket.on('error', onError);
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
