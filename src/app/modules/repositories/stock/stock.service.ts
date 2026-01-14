import { In, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ExchangeType, MarketType } from '@app/common/types';
import { Stock } from './stock.entity';

@Injectable()
export class StockService {
    constructor(
        @InjectRepository(Stock)
        private readonly stockRepository: Repository<Stock>,
    ) {}

    /**
     * 종목이 존재하는지 확인합니다.
     * @param stockCode
     */
    public async existsStock(stockCode: string) {
        return this.stockRepository.existsBy({
            shortCode: stockCode,
        });
    }

    /**
     * 종목 목록을 조회합니다.
     * @param stockCode
     */
    public async getStock(stockCode: string) {
        return this.stockRepository.findOneBy({
            shortCode: stockCode,
        });
    }

    /**
     * 종목 목록을 조회합니다.
     * @param marketType
     * @param exchangeType
     * @param name
     */
    public async getStocks({
        marketType,
        exchangeType,
        name,
    }: {
        marketType: MarketType;
        exchangeType?: ExchangeType;
        name?: string;
    }) {
        return this.stockRepository.find({
            where: {
                marketType,
                exchangeType,
                name: name ? Like(`%${name}%`) : undefined,
            },
            order: {
                name: 'ASC',
            },
        });
    }

    /**
     * 종목 목록을 조회합니다.
     * @param marketType
     * @param exchangeType
     * @param name
     */
    public async getStocksByStockCode({
        marketType,
        exchangeType,
        stockCodes,
    }: {
        marketType: MarketType;
        exchangeType?: ExchangeType;
        stockCodes: string[];
    }) {
        if (stockCodes.length === 0) {
            return [];
        }

        return this.stockRepository.find({
            where: {
                marketType,
                exchangeType,
                shortCode: In(stockCodes),
            },
        });
    }
}
