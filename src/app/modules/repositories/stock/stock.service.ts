import { Like, Repository } from 'typeorm';
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
}
