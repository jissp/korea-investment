import * as _ from 'lodash';
import { FlowProducer } from 'bullmq';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { uniqueValues } from '@common/utils';
import { PreventConcurrentExecution } from '@common/decorators';
import { getDefaultJobOptions } from '@modules/queue';
import { MarketDivCode } from '@modules/korea-investment/common';
import { KoreaInvestmentHelperService } from '@modules/korea-investment/korea-investment-helper';
import { DomesticStockQuotationsInquireInvestorParam } from '@modules/korea-investment/korea-investment-quotation-client';
import {
    KoreaInvestmentRequestApiHelper,
    KoreaInvestmentRequestApiType,
} from '@app/modules/korea-investment-request-api/common';
import { FavoriteStockService } from '@app/modules/repositories/favorite-stock';
import { StockCrawlerFlowType } from './stock-crawler.types';
import { getCurrentMarketDivCode } from '@common/domains';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { MarketType } from '@app/common';
import { StockService } from '@app/modules/repositories/stock';
import { AccountStockGroupStockService } from '@app/modules/repositories/account-stock-group';

@Injectable()
export class StockCrawlerSchedule implements OnModuleInit {
    private readonly logger = new Logger(StockCrawlerSchedule.name);

    constructor(
        private readonly requestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly stockService: StockService,
        private readonly accountStockGroupStockService: AccountStockGroupStockService,
        private readonly favoriteStockService: FavoriteStockService,
        private readonly koreaInvestmentHelperService: KoreaInvestmentHelperService,
        @Inject(StockCrawlerFlowType.RequestDailyItemChartPrice)
        private readonly requestDailyItemChartPriceFlow: FlowProducer,
        @Inject(StockCrawlerFlowType.RequestStockInvestor)
        private readonly requestStockInvestorFlow: FlowProducer,
        @Inject(StockCrawlerFlowType.UpdateAccountStockGroupStockPrices)
        private readonly updateAccountStockGroupStockPricesFlow: FlowProducer,
    ) {}

    onModuleInit() {
        // this.handleCrawlingStockInvestor();
        // this.handleCrawlingStockDailyItemChartPrice();
        this.handleUpdateAccountStockGroupStockPrices();
    }

    @Cron('0 16 * * *') // 매일 16시에 실행 (장 마감 후)
    @PreventConcurrentExecution()
    async handleCrawlingStockInvestor() {
        return;

        try {
            const favoriteStocks = await this.favoriteStockService.findAll();
            const stockCodes = uniqueValues(
                favoriteStocks.map((favoriteStock) => favoriteStock.stockCode),
            );

            const queueName = StockCrawlerFlowType.RequestStockInvestor;
            await this.requestStockInvestorFlow.add(
                {
                    name: queueName,
                    queueName: queueName,
                    children: stockCodes.map((stockCode) => {
                        return this.requestApiHelper.generateRequestApi<DomesticStockQuotationsInquireInvestorParam>(
                            KoreaInvestmentRequestApiType.Additional,
                            {
                                url: '/uapi/domestic-stock/v1/quotations/inquire-investor',
                                tradeId: 'FHKST01010900',
                                params: {
                                    FID_COND_MRKT_DIV_CODE: MarketDivCode.통합,
                                    FID_INPUT_ISCD: stockCode,
                                },
                            },
                        );
                    }),
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
        } catch (error) {
            this.logger.error(error);
        }
    }

    @Cron('*/10 * * * * *')
    @PreventConcurrentExecution()
    async handleUpdateAccountStockGroupStockPrices() {
        try {
            const marketDivCode = getCurrentMarketDivCode();
            if (isNil(marketDivCode)) {
                return;
            }

            const stocksByStockGroup =
                await this.accountStockGroupStockService.getAll();
            const stockCodes = uniqueValues(
                stocksByStockGroup.map((stock) => stock.stockCode),
            );

            const stocks = await this.stockService.getStocksByStockCode({
                marketType: MarketType.Domestic,
                stockCodes,
            });

            const queueName =
                StockCrawlerFlowType.UpdateAccountStockGroupStockPrices;
            await Promise.all(
                _.chunk(stocks, 30).map((stocks) => {
                    const stockCodes = stocks.map((stock) => stock.shortCode);

                    return this.updateAccountStockGroupStockPricesFlow.add(
                        {
                            name: queueName,
                            queueName,
                            children: [
                                this.requestApiHelper.generateRequestApiForIntstockMultiPrice(
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
                }),
            );
        } catch (error) {
            this.logger.error(error);
        }
    }
}
