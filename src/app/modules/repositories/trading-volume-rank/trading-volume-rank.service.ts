import { sortBy } from 'lodash';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TradingVolumeRankDto } from './trading-volume-rank.types';
import { TradingVolumeRank } from './trading-volume-rank.entity';

@Injectable()
export class TradingVolumeRankService {
    constructor(
        @InjectRepository(TradingVolumeRank)
        private readonly repository: Repository<TradingVolumeRank>,
    ) {}

    /**
     * 거래량 순위 데이터를 업데이트 합니다.
     * @param dto
     */
    public async upsert(dto: TradingVolumeRankDto | TradingVolumeRankDto[]) {
        return this.repository
            .createQueryBuilder()
            .insert()
            .into(TradingVolumeRank)
            .values(dto)
            .orUpdate(
                ['price', 'change_price', 'change_price_rate'],
                ['stock_code'],
            )
            .updateEntity(false)
            .execute();
    }

    /**
     * 거래량 순위 데이터를 최신순으로 조회합니다.
     * @param limit
     */
    public async getLatestTradingVolumeRanks(limit: number = 30) {
        const tradingVolumeRanks = await this.repository.find({
            order: {
                updatedAt: 'DESC',
            },
            take: limit,
        });

        // 여기서 sort를 한번 더 하는 이유는 updatedAt 기준으로 내림차순 정렬 후, 거래량 기준으로 내림차순 정렬을 하기 위함입니다.
        return sortBy(tradingVolumeRanks, (v) => v.tradingVolume).reverse();
    }
}
