import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
    KoreaInvestmentWebSocketHelperService,
    TransformResult,
} from '@modules/korea-investment/korea-investment-web-socket';
import { KoreaInvestmentCollectorEventType } from './korea-investment-collector.types';

@Injectable()
export class KoreaInvestmentCollectorListener {
    private readonly logger = new Logger(KoreaInvestmentCollectorListener.name);

    constructor(
        private readonly helperService: KoreaInvestmentWebSocketHelperService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    @OnEvent(
        KoreaInvestmentCollectorEventType.MessageReceivedFromKoreaInvestment,
    )
    public handleReceiveMessage({ tradeId, records }: TransformResult) {
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
