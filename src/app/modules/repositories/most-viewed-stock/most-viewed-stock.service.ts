import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MostViewedStockDto } from './most-viewed-stock.types';
import { MostViewedStock } from './most-viewed-stock.entity';

@Injectable()
export class MostViewedStockService {
    constructor(
        @InjectRepository(MostViewedStock)
        private readonly mostViewedStockRepository: Repository<MostViewedStock>,
    ) {}

    /**
     * 실시간 인기 조회 종목 데이터를 업데이트합니다.
     * @param dto
     */
    public async upsert(dto: MostViewedStockDto | MostViewedStockDto[]) {
        return this.mostViewedStockRepository
            .createQueryBuilder()
            .insert()
            .into(MostViewedStock)
            .values(dto)
            .orUpdate(
                [
                    'price',
                    'change_price',
                    'change_price_rate',
                    'trading_volume',
                ],
                ['stockCode'],
            )
            .updateEntity(false)
            .execute();
    }

    /**
     * 최근 인기 조회 종목 데이터를 조회합니다.
     * @param limit 조회할 데이터 수
     */
    public async getLatestMostViewedStocks(limit: number = 20) {
        return this.mostViewedStockRepository.find({
            order: {
                updatedAt: 'DESC',
            },
            take: limit,
        });
    }
}
