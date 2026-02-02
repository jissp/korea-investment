import { Injectable, Logger } from '@nestjs/common';
import { uniqueValues } from '@common/utils';
import { MarketType } from '@app/common/types';
import { KoreaInvestmentCalendarService } from '@app/modules/repositories/korea-investment-calendar';
import { Stock, StockService } from '@app/modules/repositories/stock';
import { AccountStockGroupStockService } from '@app/modules/repositories/account-stock-group';
import { FavoriteStockService } from '@app/modules/repositories/favorite-stock';
import { StockInvestorService } from '@app/modules/repositories/stock-investor';

@Injectable()
export class StockCrawlerService {
    private readonly logger = new Logger(StockCrawlerService.name);

    constructor(
        private readonly koreaInvestmentHolidayService: KoreaInvestmentCalendarService,
        private readonly accountStockGroupStockService: AccountStockGroupStockService,
        private readonly stockService: StockService,
        private readonly favoriteStockService: FavoriteStockService,
        private readonly stockInvestorService: StockInvestorService,
    ) {}

    /**
     * UpdateAccountStockGroupStockPrices 대상 Stock 목록을 조회합니다.
     */
    public async getStocksForUpdateAccountStockGroupStockPrices() {
        const stocksByStockGroup =
            await this.accountStockGroupStockService.getAll();
        const stockCodes = uniqueValues(
            stocksByStockGroup.map((stock) => stock.stockCode),
        );

        return this.stockService.getStocksByStockCode({
            marketType: MarketType.Domestic,
            stockCodes,
        });
    }

    public async assertKoreaInvestmentHoliday(todayYmd: string) {
        const latestBusinessDay =
            await this.koreaInvestmentHolidayService.getLatestBusinessDayByDate(
                {
                    date: todayYmd,
                },
            );

        if (!latestBusinessDay) {
            throw new Error('Latest business day not found');
        }

        return latestBusinessDay;
    }

    public async getStocksByFavoriteStocks() {
        const favoriteStocks = await this.favoriteStockService.findAll();

        return this.stockService.getStocksByStockCode({
            marketType: MarketType.Domestic,
            stockCodes: favoriteStocks.map(
                (favoriteStock) => favoriteStock.stockCode,
            ),
        });
    }

    /**
     * Stock 별 금일 투자자 동향 정보 유무를 Aggregate 합니다.
     * @param stocks
     */
    public async aggregateExistsStockInvestor(stocks: Stock[]) {
        return Promise.all(
            stocks.map(async (stock) => {
                return {
                    stock,
                    isExists: await this.stockInvestorService.existsByStockCode(
                        stock.shortCode,
                    ),
                };
            }),
        );
    }
}
