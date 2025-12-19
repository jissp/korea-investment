import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
    KoreaInvestmentWebSocketHelperService,
    TransformResult,
} from '@modules/korea-investment/korea-investment-web-socket';
import { KoreaInvestmentSettingService } from '@app/modules/korea-investment-setting';
import { KoreaInvestmentCollectorEventType } from './korea-investment-collector.types';
import { KoreaInvestmentCollectorSocket } from './korea-investment-collector.socket';

@Injectable()
export class KoreaInvestmentCollectorListener {
    private readonly DEFAULT_TRADE_IDS = ['H0UNASP0', 'H0UNCNT0'] as const;

    constructor(
        private readonly logger: Logger,
        private readonly helperService: KoreaInvestmentWebSocketHelperService,
        private readonly koreaInvestmentSettingService: KoreaInvestmentSettingService,
        private readonly koreaInvestmentCollectorSocket: KoreaInvestmentCollectorSocket,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    @OnEvent(KoreaInvestmentCollectorEventType.Opened)
    public async handleSocketOpened() {
        try {
            const stockCodes =
                await this.koreaInvestmentSettingService.getStockCodes();

            await Promise.all(
                this.DEFAULT_TRADE_IDS.flatMap((trId) =>
                    stockCodes.map((stockCode) =>
                        this.koreaInvestmentCollectorSocket.subscribe({
                            tr_id: trId,
                            tr_key: stockCode,
                        }),
                    ),
                ),
            );
        } catch (error) {
            this.logger.error(error);
        }
    }

    @OnEvent(KoreaInvestmentCollectorEventType.Closed)
    public async handleSocketClosed() {
        try {
            if (!this.koreaInvestmentCollectorSocket.isConnected()) {
                await this.koreaInvestmentCollectorSocket.reconnect();
            }
        } catch (error) {
            this.logger.error(error);
        }
    }

    @OnEvent(
        KoreaInvestmentCollectorEventType.MessageReceivedFromKoreaInvestment,
    )
    public async handleReceiveMessage({ tradeId, records }: TransformResult) {
        try {
            const pipe = this.helperService.getPipe(tradeId);

            for (const record of records) {
                const realtimeData = pipe.transform(record);

                this.eventEmitter.emit(
                    KoreaInvestmentCollectorEventType.MessagePublishedToGateway,
                    {
                        tradeId,
                        record: realtimeData,
                    },
                );
            }
        } catch (error) {
            this.logger.error(error);
        }
    }
}
