import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { uniqueValues } from '@common/utils';
import { MarketType } from '@app/common';
import { StockService } from '@app/modules/repositories/stock';
import { FavoriteStock } from '@app/modules/repositories/favorite-stock';
import {
    StockDailyInvestor,
    StockHourForeignerInvestor,
} from '@app/modules/repositories/stock-investor';
import { AccountStockGroupStockService } from '@app/modules/repositories/account-stock-group';

@Injectable()
export class StockCrawlerService {
    private readonly logger = new Logger(StockCrawlerService.name);

    constructor(
        private readonly accountStockGroupStockService: AccountStockGroupStockService,
        private readonly stockService: StockService,
        @InjectRepository(FavoriteStock)
        private readonly favoriteStockRepository: Repository<FavoriteStock>,
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

    /**
     * UpdateAccountStockGroupStockPrices 대상 Stock 목록을 조회합니다.
     */
    public async getStocksForCrawlingStockInvestor(date: string) {
        const favoriteStockAlias = FavoriteStock.name;
        const dailyInvestorAlias = StockDailyInvestor.name;

        const nullFavoriteStocks = await this.favoriteStockRepository
            .createQueryBuilder(favoriteStockAlias)
            .leftJoin(
                StockDailyInvestor,
                dailyInvestorAlias,
                `${favoriteStockAlias}.stock_code = ${dailyInvestorAlias}.stock_code AND date = :date`,
                {
                    date,
                },
            )
            .where(`${dailyInvestorAlias}.id IS NULL`)
            .getMany();

        return this.stockService.getStocksByStockCode({
            marketType: MarketType.Domestic,
            stockCodes: nullFavoriteStocks.map((stock) => stock.stockCode),
        });
    }

    /**
     * RequestStockHourInvestorByForeigner 대상 Stock 목록을 조회합니다.
     */
    public async getStocksForRequestStockHourInvestorByForeigner(
        date: string,
        timeCode: '1' | '2' | '3' | '4' | '5',
    ) {
        const favoriteStockAlias = FavoriteStock.name;
        const stockHourForeignerInvestorAlias = StockHourForeignerInvestor.name;

        const nullFavoriteStocks = await this.favoriteStockRepository
            .createQueryBuilder(favoriteStockAlias)
            .leftJoin(
                StockHourForeignerInvestor,
                stockHourForeignerInvestorAlias,
                `${favoriteStockAlias}.stock_code = ${stockHourForeignerInvestorAlias}.stock_code AND ${stockHourForeignerInvestorAlias}.date = '${date}' AND ${stockHourForeignerInvestorAlias}.time_code = '${timeCode}'`,
            )
            .where(`${stockHourForeignerInvestorAlias}.id IS NULL`)
            .getMany();

        return this.stockService.getStocksByStockCode({
            marketType: MarketType.Domestic,
            stockCodes: nullFavoriteStocks.map((stock) => stock.stockCode),
        });
    }
}
