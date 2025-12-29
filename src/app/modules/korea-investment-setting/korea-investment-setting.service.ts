import { Injectable } from '@nestjs/common';
import { RedisHelper, RedisSet } from '@modules/redis';
import { KoreaInvestmentSettingKey } from './korea-investment-setting.types';

@Injectable()
export class KoreaInvestmentSettingService {
    private readonly stockCodeSet: RedisSet;

    constructor(private readonly redisHelper: RedisHelper) {
        this.stockCodeSet = redisHelper.createSet(
            KoreaInvestmentSettingKey.StockCodes,
        );
    }

    /**
     * 종목 코드를 조회합니다.
     */
    public async getStockCodes() {
        return this.stockCodeSet.list();
    }

    /**
     * 종목 코드가 존재하는지 확인합니다.
     * @param stockCode
     */
    public async existsStockCode(stockCode: string) {
        return this.stockCodeSet.exists(stockCode);
    }

    /**
     * 종목 코드를 추가합니다.
     * @param stockCode
     */
    public async addStockCode(stockCode: string) {
        return this.stockCodeSet.add(stockCode);
    }

    /**
     * 종목 코드를 삭제합니다.
     * @param stockCode
     */
    public async deleteStockCode(stockCode: string) {
        return this.stockCodeSet.remove(stockCode);
    }
}
