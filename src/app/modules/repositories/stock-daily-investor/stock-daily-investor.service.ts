import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockDailyInvestor } from './stock-daily-investor.entity';
import { StockDailyInvestorDto } from './stock-daily-investor.types';
import { toDateYmdByDate } from '@common/utils';

@Injectable()
export class StockDailyInvestorService {
    constructor(
        @InjectRepository(StockDailyInvestor)
        private readonly stockDailyInvestorRepository: Repository<StockDailyInvestor>,
    ) {}

    /**
     * 일별 투자자 동향 정보 업데이트
     * @param stockDailyInvestorDto
     */
    public async upsert(stockDailyInvestorDto: StockDailyInvestorDto) {
        return this.stockDailyInvestorRepository
            .createQueryBuilder()
            .insert()
            .into(StockDailyInvestor)
            .values(stockDailyInvestorDto)
            .orUpdate(
                ['price', 'person', 'foreigner', 'organization'],
                ['date', 'stockCode'],
            )
            .updateEntity(false)
            .execute();
    }

    /**
     * 일별 투자자 동향 정보 업데이트
     * @param stockCode
     * @param date
     */
    public async getTodayDailyInvestor({ stockCode }: { stockCode: string }) {
        return this.stockDailyInvestorRepository.findOneBy({
            date: toDateYmdByDate(),
            stockCode,
        });
    }

    /**
     * 일별 투자자 동향 정보 업데이트
     * @param stockCode
     * @param date
     * @param limit
     */
    public async getStockDailyInvestors({
        stockCode,
        limit = 7,
    }: {
        stockCode: string;
        limit?: number;
    }) {
        return this.stockDailyInvestorRepository.find({
            where: {
                stockCode,
            },
            order: {
                date: 'DESC',
            },
            take: limit,
        });
    }
}
