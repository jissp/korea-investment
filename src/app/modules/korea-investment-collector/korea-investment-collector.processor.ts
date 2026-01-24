import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnQueueProcessor } from '@modules/queue';
import { CustomerType } from '@modules/korea-investment/common';
import {
    KoreaInvestmentWebSocketHelperService,
    SubscribeRequest,
    SubscribeType,
    WebSocketHeader,
} from '@modules/korea-investment/korea-investment-web-socket';
import {
    KoreaInvestmentCollectorQueueType,
    KoreaInvestmentRequestRealTimeJobPayload,
} from './korea-investment-collector.types';
import { KoreaInvestmentCollectorSocket } from './korea-investment-collector.socket';

@Injectable()
export class KoreaInvestmentCollectorProcessor {
    /*
     * 국내주식 실시간체결가(통합): H0UNCNT0
     * 국내주식 실시간호가(통합): H0UNASP0
     * 국내주식 실시간예상체결(통합): H0UNANC0
     * 국내주식 실시간회원사(통합): H0UNMBC0
     * 국내주식 실시간프로그램매매(통합): H0UNPGM0
     */
    private realTimeTradeIds = [
        'H0UNCNT0',
        'H0UNASP0',
        'H0UNANC0',
        'H0UNMBC0',
        'H0UNPGM0',
    ];

    private readonly logger = new Logger(
        KoreaInvestmentCollectorProcessor.name,
    );

    constructor(
        private readonly helperService: KoreaInvestmentWebSocketHelperService,
        private readonly collectorSocket: KoreaInvestmentCollectorSocket,
    ) {}

    /**
     * 한국투자증권으로 구독 / 구독 해지 요청을 전송하는 Job
     * @param job
     */
    @OnQueueProcessor(KoreaInvestmentCollectorQueueType.RequestRealTimeData, {
        concurrency: 1,
    })
    public async processRealTimeDataRequest(
        job: Job<KoreaInvestmentRequestRealTimeJobPayload>,
    ) {
        try {
            const { stockCode, subscribeType } = job.data;

            // 패킷 메세지 빌드
            const approvalKey = await this.helperService.getWebSocketToken();
            const messages = this.realTimeTradeIds.map((tradeId) => ({
                header: this.buildSubscribeHeader(subscribeType, approvalKey),
                body: {
                    input: {
                        tr_id: tradeId,
                        tr_key: stockCode,
                    } as SubscribeRequest,
                },
            }));

            // 패킷 전송
            await Promise.all(
                messages.map((message) => this.collectorSocket.send(message)),
            );
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
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
