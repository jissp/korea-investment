import { chunk, groupBy } from 'lodash';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { toDateYmdByDate } from '@common/utils';
import { PreventConcurrentExecution } from '@common/decorators';
import { getMarketDivCodeByDate } from '@common/domains';
import { MarketDivCode } from '@modules/korea-investment/common';
import { YN } from '@app/common/types';
import { Stock } from '@app/modules/repositories/stock';
import { StockCrawlerService } from './stock-crawler.service';
import { StockCrawlerQueueService } from './stock-crawler-queue.service';

@Injectable()
export class StockCrawlerSchedule implements OnModuleInit {
    private readonly logger = new Logger(StockCrawlerSchedule.name);

    constructor(
        private readonly queueService: StockCrawlerQueueService,
        private readonly stockCrawlerService: StockCrawlerService,
    ) {}

    onModuleInit() {
        this.handleCrawlingStockInvestorForMarketOpened();
        this.handleCrawlingStockInvestorForMarketClosed();
        this.handleUpdateAccountStockGroupStockPrices();
    }

    @Cron('*/10 * * * *')
    @PreventConcurrentExecution()
    async handleCrawlingStockInvestorForMarketOpened() {
        const currentDate = new Date();

        const marketDivCode = getMarketDivCodeByDate(currentDate);
        if (isNil(marketDivCode)) {
            return;
        }

        const todayYmd = toDateYmdByDate({
            date: currentDate,
            separator: '-',
        });

        const latestBusinessDay =
            await this.stockCrawlerService.assertKoreaInvestmentBusinessDay(
                todayYmd,
            );
        if (latestBusinessDay.isOpen === YN.N) {
            return;
        }

        const stocks =
            await this.stockCrawlerService.getStocksByFavoriteStocks();

        const filterStocksByMarketDivCode = (
            stocks: Stock[],
            marketDivCode: MarketDivCode,
        ): Stock[] => {
            if (marketDivCode === MarketDivCode.NXT) {
                return stocks.filter((stock) => stock.isNextTrade === YN.Y);
            }
            return stocks;
        };

        const filteredStocks = filterStocksByMarketDivCode(
            stocks,
            marketDivCode,
        );

        await this.queueService.addRequestStockInvestorJobs(
            filteredStocks,
            todayYmd,
        );
    }

    @Cron('*/10 * * * *')
    @PreventConcurrentExecution()
    async handleCrawlingStockInvestorForMarketClosed() {
        const currentDate = new Date();

        const marketDivCode = getMarketDivCodeByDate(currentDate);
        if (!isNil(marketDivCode)) {
            return;
        }

        const todayYmd = toDateYmdByDate({
            date: currentDate,
            separator: '-',
        });

        const latestBusinessDay =
            await this.stockCrawlerService.assertKoreaInvestmentBusinessDay(
                todayYmd,
            );
        if (latestBusinessDay.isOpen === YN.N) {
            return;
        }

        const stocks =
            await this.stockCrawlerService.getStocksByFavoriteStocks();

        const aggregatedStocks =
            await this.stockCrawlerService.aggregateExistsStockInvestor(stocks);

        const filteredStocks = aggregatedStocks.filter(
            (aggregatedStock) => aggregatedStock.isExists,
        );

        await this.queueService.addRequestStockInvestorJobs(
            filteredStocks.map(({ stock }) => stock),
            todayYmd,
        );
    }

    @Cron('*/10 * * * * *')
    @PreventConcurrentExecution()
    async handleUpdateAccountStockGroupStockPrices() {
        try {
            const stocks =
                await this.stockCrawlerService.getStocksForUpdateAccountStockGroupStockPrices();

            const groupedStocks = groupBy(
                stocks,
                (stock: Stock) => stock.isNextTrade,
            );

            for (const [isNextTrade, stocks] of Object.entries(
                groupedStocks,
            ) as [YN, Stock[]][]) {
                await Promise.all(
                    chunk(stocks, 30).map((stocks) =>
                        this.queueService.addUpdateAccountStockGroupStockPriceJobs(
                            stocks,
                            isNextTrade,
                        ),
                    ),
                );
            }
        } catch (error) {
            this.logger.error(error);
        }
    }
}
