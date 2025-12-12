import { Cluster } from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';
import { RedisConnection } from '@modules/redis';

@Injectable()
export class KoreaInvestmentSettingService {
    constructor(@Inject(RedisConnection) private readonly redis: Cluster) {}

    /**
     * @param stockCode
     */
    public async addStockCode(stockCode: string) {
        return this.redis.sadd('stockCodes', stockCode);
    }

    /**
     */
    public async getStockCodes() {
        return this.redis.smembers('stockCodes');
    }

    /**
     * @param stockCode
     */
    public async removeStockCode(stockCode: string) {
        return this.redis.srem('stockCodes', stockCode);
    }
}
