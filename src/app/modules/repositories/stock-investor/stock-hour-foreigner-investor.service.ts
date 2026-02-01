import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockHourForeignerInvestor } from './entities';
import { StockHourForeignerInvestorDto } from './stock-investor.types';
import { toDateYmdByDate } from '@common/utils';

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
    public async getListByStockCode({
        stockCode,
        date,
    }: {
        stockCode: string;
        date: string;
    }) {
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

    /**
     * 특정 종목들의 오늘 시간별 투자자 동향 정보 조회
     */
    public async getStockHourForeignerInvestorsByStockCodes(
        stockCodes: string[],
    ) {
        const targetDate = new Date();
        const startDate = toDateYmdByDate({
            separator: '-',
            date: targetDate,
        });

        return this.repository.find({
            where: {
                date: startDate,
                stockCode: In(stockCodes),
            },
            order: {
                stockCode: 'ASC',
                date: 'DESC',
            },
        });
    }
}
