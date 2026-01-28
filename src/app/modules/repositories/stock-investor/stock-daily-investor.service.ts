import { MoreThanOrEqual, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { toDateYmdByDate } from '@common/utils';
import { StockDailyInvestor } from './entities/stock-daily-investor.entity';
import { StockDailyInvestorDto } from './stock-investor.types';

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
    public async upsert(
        stockDailyInvestorDto: StockDailyInvestorDto | StockDailyInvestorDto[],
    ) {
        return this.stockDailyInvestorRepository
            .createQueryBuilder()
            .insert()
            .into(StockDailyInvestor)
            .values(stockDailyInvestorDto)
            .orUpdate(
                ['price', 'person', 'foreigner', 'organization'],
                ['date', 'stock_code'],
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
            date: toDateYmdByDate({
                separator: '-',
            }),
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

    /**
     * 최근 N일간 모든 종목의 투자자 동향 정보 조회
     * @param days
     */
    public async getAllStockDailyInvestorsByDays(days: number = 7) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - days);
        const startDate = toDateYmdByDate({
            separator: '-',
            date: targetDate,
        });

        const query =
            this.stockDailyInvestorRepository.createQueryBuilder('sdi');

        // 최근 N일 데이터 조회
        return query
            .where({
                date: MoreThanOrEqual(startDate),
            })
            .orderBy('sdi.stock_code', 'ASC')
            .addOrderBy('sdi.date', 'DESC')
            .getMany();
    }
}
