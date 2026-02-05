import { Job } from 'bullmq';
import {
    Injectable,
    Logger,
    NotFoundException,
    OnModuleDestroy,
} from '@nestjs/common';
import { sleep } from '@common/utils';
import { OnQueueProcessor } from '@modules/queue';
import { CustomerType } from '@modules/korea-investment/common';
import {
    KoreaInvestmentWebSocketHelperService,
    SubscribePayload,
    SubscribeType,
    WebSocketHeader,
} from '@modules/korea-investment/korea-investment-web-socket';
import { Stock, StockService } from '@app/modules/repositories/stock';
import {
    KoreaInvestmentCollectorQueueType,
    KoreaInvestmentRequestRealTimeJobPayload,
} from './korea-investment-collector.types';
import { KoreaInvestmentCollectorSocket } from './korea-investment-collector.socket';

interface SubscribeStockMapItem {
    tradeIds: string[];
    stock: Stock;
}

@Injectable()
export class KoreaInvestmentCollectorProcessor implements OnModuleDestroy {
    private readonly logger = new Logger(
        KoreaInvestmentCollectorProcessor.name,
    );

    private subscribeStockMap: Map<string, SubscribeStockMapItem> = new Map();

    constructor(
        private readonly stockService: StockService,
        private readonly helperService: KoreaInvestmentWebSocketHelperService,
        private readonly collectorSocket: KoreaInvestmentCollectorSocket,
    ) {}

    async onModuleDestroy() {
        try {
            this.logger.debug('Destroying');

            if (!this.collectorSocket.isConnected()) {
                return;
            }

            const approvalKey = await this.helperService.getWebSocketToken();

            const stockCodes = Object.keys(this.subscribeStockMap);
            const subscribeMessages = stockCodes.flatMap((stockCode) =>
                this.buildSubscribeMessages(
                    approvalKey,
                    SubscribeType.Unsubscribe,
                    stockCode,
                ),
            );

            await this.sendSubscribeMessages(subscribeMessages);

            await this.collectorSocket.disconnect();
        } finally {
            this.logger.debug('Destroyed');
        }
    }

    /**
     * 한국투자증권으로 구독 / 구독 해지 요청을 전송하는 Job
     * @param job
     */
    @OnQueueProcessor(KoreaInvestmentCollectorQueueType.SubscribeStock, {
        concurrency: 1,
    })
    public async processSubscribeStock(
        job: Job<KoreaInvestmentRequestRealTimeJobPayload>,
    ) {
        try {
            const { subscribeType, stockCode } = job.data;

            if (!this.needSubscribe(subscribeType, stockCode)) {
                return;
            }

            const stock = await this.stockService.getStock(stockCode);
            if (!stock) {
                throw new NotFoundException('Stock Not found');
            }

            this.logger.debug(`SubscribeStock, ${subscribeType}, ${stockCode}`);

            const approvalKey = await this.helperService.getWebSocketToken();
            const isSubscribe = subscribeType === SubscribeType.Subscribe;

            if (isSubscribe) {
                /*
                 * 국내주식 실시간체결가(통합): H0UNCNT0
                 * 국내주식 실시간호가(통합): H0UNASP0
                 * 국내주식 실시간프로그램매매(통합): H0UNPGM0
                 */
                const tradeStreamType = stock.isNextTrade
                    ? 'H0UNCNT0'
                    : 'H0STCNT0';
                this.subscribeStockMap.set(stockCode, {
                    stock,
                    tradeIds: [tradeStreamType, 'H0UNPGM0'],
                });
            }

            // 패킷 메세지 전송
            const messages = this.buildSubscribeMessages(
                approvalKey,
                subscribeType,
                stockCode,
            );
            await this.sendSubscribeMessages(messages);

            if (!isSubscribe) {
                this.subscribeStockMap.delete(stockCode);
            }

            if (this.subscribeStockMap.size === 0) {
                this.logger.debug(
                    'Socket Disconnected (reason: subscribeStockCode Empty)',
                );
                await this.collectorSocket.disconnect();
            }
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    /**
     * 구독 요청/해제 패킷 메세지들을 빌드합니다.
     * @param approvalKey
     * @param subscribeType
     * @param stockCode
     * @private
     */
    private buildSubscribeMessages(
        approvalKey: string,
        subscribeType: SubscribeType,
        stockCode: string,
    ) {
        const subscribeStock = this.subscribeStockMap.get(stockCode);
        if (!subscribeStock) {
            throw Error('subscribeStock is null');
        }

        return subscribeStock.tradeIds.map(
            (tradeId): SubscribePayload => ({
                header: this.buildSubscribeHeader(subscribeType, approvalKey),
                body: {
                    input: {
                        tr_id: tradeId,
                        tr_key: stockCode,
                    },
                },
            }),
        );
    }

    /**
     * Korea Investment Web Socket 요청 패킷을 전송합니다.
     * @param messages
     * @private
     */
    private async sendSubscribeMessages(messages: SubscribePayload[]) {
        for (const message of messages) {
            await this.collectorSocket.send(message);
            await sleep(200);
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

    /**
     * @param subscribeType
     * @param stockCode
     * @private
     */
    private needSubscribe(subscribeType: SubscribeType, stockCode: string) {
        if (subscribeType === SubscribeType.Subscribe) {
            return !this.subscribeStockMap.has(stockCode);
        }

        return this.subscribeStockMap.has(stockCode);
    }
}
