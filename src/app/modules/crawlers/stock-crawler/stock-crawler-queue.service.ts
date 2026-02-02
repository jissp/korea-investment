import { FlowProducer } from 'bullmq';
import { FlowJob, FlowOpts } from 'bullmq/dist/esm/interfaces';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getMarketDivCodeByIsNextTrade } from '@common/domains';
import { getDefaultJobOptions } from '@modules/queue';
import { MarketDivCode } from '@modules/korea-investment/common';
import { YN } from '@app/common/types';
import {
    KoreaInvestmentRequestApiHelper,
    KoreaInvestmentRequestApiType,
} from '@app/modules/korea-investment-request-api/common';
import { Stock } from '@app/modules/repositories/stock';
import { StockCrawlerFlowType } from './stock-crawler.types';

@Injectable()
export class StockCrawlerQueueService {
    private readonly logger = new Logger(StockCrawlerQueueService.name);

    constructor(
        private readonly requestApiHelper: KoreaInvestmentRequestApiHelper,
        @Inject(StockCrawlerFlowType.RequestStockInvestor)
        private readonly requestStockInvestorFlow: FlowProducer,
        @Inject(StockCrawlerFlowType.UpdateAccountStockGroupStockPrices)
        private readonly updateAccountStockGroupStockPricesFlow: FlowProducer,
    ) {}

    /**
     * 투자자 동향 정보 수집 요청 Job을 추가합니다.
     * @param stocks
     * @param todayYmd
     */
    public async addRequestStockInvestorJobs(
        stocks: Stock[],
        todayYmd: string,
    ) {
        const queueName = StockCrawlerFlowType.RequestStockInvestor;

        const flowOptions: FlowOpts = {
            queuesOptions: {
                [queueName]: {
                    defaultJobOptions: getDefaultJobOptions(),
                },
                [KoreaInvestmentRequestApiType.Additional]: {
                    defaultJobOptions: getDefaultJobOptions(),
                },
            },
        };
        const stockFlowJobs = stocks.map((stock): FlowJob => {
            const marketDivCode = getMarketDivCodeByIsNextTrade(
                stock.isNextTrade,
            );

            return {
                name: queueName,
                queueName,
                children: [
                    this.requestApiHelper.generateDomesticInvestorTradeByStockDaily(
                        {
                            FID_INPUT_ISCD: stock.shortCode,
                            FID_COND_MRKT_DIV_CODE: marketDivCode,
                            FID_INPUT_DATE_1: todayYmd,
                            FID_ETC_CLS_CODE: '',
                            FID_ORG_ADJ_PRC: '',
                        },
                    ),
                ],
                opts: {
                    jobId: `stock_${stock.shortCode.toString()}`,
                },
            };
        });

        return Promise.allSettled(
            stockFlowJobs.map((stockFlowJob) =>
                this.requestStockInvestorFlow.add(stockFlowJob, flowOptions),
            ),
        );
    }

    /**
     * 계좌별 관심 그룹 종목의 가격 수집 요청하는 Job을 추가합니다.
     * @param stocks
     * @param isNextTrade
     */
    public async addUpdateAccountStockGroupStockPriceJobs(
        stocks: Stock[],
        isNextTrade: YN,
    ) {
        const queueName =
            StockCrawlerFlowType.UpdateAccountStockGroupStockPrices;

        const stockCodes = stocks.map((stock) => stock.shortCode);

        return this.updateAccountStockGroupStockPricesFlow.add(
            {
                name: queueName,
                queueName,
                children: [
                    this.requestApiHelper.generateRequestApiForIntstockMultiPrice(
                        isNextTrade === YN.Y
                            ? MarketDivCode.통합
                            : MarketDivCode.KRX,
                        stockCodes,
                    ),
                ],
            },
            {
                queuesOptions: {
                    [queueName]: {
                        defaultJobOptions: getDefaultJobOptions(),
                    },
                    [KoreaInvestmentRequestApiType.Additional]: {
                        defaultJobOptions: getDefaultJobOptions(),
                    },
                },
            },
        );
    }
}
