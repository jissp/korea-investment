import { In, MoreThanOrEqual, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { toDateYmdByDate } from '@common/utils';
import { StockInvestor } from './stock-investor.entity';
import { StockInvestorDto } from './stock-investor.types';

@Injectable()
export class StockInvestorService {
    constructor(
        @InjectRepository(StockInvestor)
        private readonly stockInvestorRepository: Repository<StockInvestor>,
    ) {}

    /**
     * 일별 투자자 동향 정보 업데이트
     * @param stockInvestorDto
     */
    public async upsert(
        stockInvestorDto: StockInvestorDto | StockInvestorDto[],
    ) {
        return this.stockInvestorRepository
            .createQueryBuilder()
            .insert()
            .into(StockInvestor)
            .values(stockInvestorDto)
            .orUpdate(
                [
                    'price',
                    'high_price',
                    'low_price',
                    'trade_volume',
                    'person',
                    'foreigner',
                    'organization',
                    'financial_investment',
                    'investment_trust',
                    'private_equity',
                    'bank',
                    'insurance',
                    'merchant_bank',
                    'fund',
                    'etc',
                ],
                ['date', 'stock_code'],
            )
            .updateEntity(false)
            .execute();
    }

    /**
     * 종목의 오늘 투자자 동향 정보가 존재하는지 확인합니다.
     * @param stockCode
     */
    public async existsByStockCode(stockCode: string) {
        return this.stockInvestorRepository.existsBy({
            date: toDateYmdByDate({
                separator: '-',
            }),
            stockCode,
        });
    }

    /**
     * 종목의 최근 n일 투자자 동향 정보를 조회합니다.
     * @param stockCode
     * @param date
     * @param limit
     */
    public async getListByStockCode({
        stockCode,
        limit = 7,
    }: {
        stockCode: string;
        limit?: number;
    }) {
        return this.stockInvestorRepository.find({
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
     * 최근 N일간 전달한 종목의 투자자 동향 정보 조회
     * @param days
     * @param stockCodes
     */
    public async getListByDays({
        days = 7,
        stockCodes,
    }: {
        days: number;
        stockCodes: string[];
    }) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - days);
        const startDate = toDateYmdByDate({
            separator: '-',
            date: targetDate,
        });

        return this.stockInvestorRepository.find({
            where: {
                date: MoreThanOrEqual(startDate),
                stockCode: In(stockCodes),
            },
            order: {
                stockCode: 'ASC',
                date: 'DESC',
            },
        });
    }
}
