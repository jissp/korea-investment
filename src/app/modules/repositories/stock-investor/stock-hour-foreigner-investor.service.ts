import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockHourForeignerInvestor } from './entities';
import { StockHourForeignerInvestorDto } from './stock-investor.types';

@Injectable()
export class StockHourForeignerInvestorService {
    constructor(
        @InjectRepository(StockHourForeignerInvestor)
        private readonly repository: Repository<StockHourForeignerInvestor>,
    ) {}

    /**
     * @param stockCode
     * @param date
     * @param timeCode
     */
    public async exists(
        stockCode: string,
        date: string,
        timeCode: '1' | '2' | '3' | '4' | '5',
    ) {
        return this.repository.existsBy({
            date,
            stockCode,
            timeCode,
        });
    }

    /**
     * @param dto
     */
    public async insert(
        dto: StockHourForeignerInvestorDto | StockHourForeignerInvestorDto[],
    ) {
        return this.repository.insert(dto);
    }

    /**
     * @param stockCode
     * @param date
     */
    public async getListByStockCode(stockCode: string, date: string) {
        return this.repository.find({
            where: {
                stockCode,
                date,
            },
            order: {
                timeCode: 'ASC',
            },
        });
    }
}
