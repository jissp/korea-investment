import { Injectable } from '@nestjs/common';
import { RedisHelper } from '@modules/redis';

export enum KoreaInvestmentSettingKey {
    StockCodes = 'Setting:StockCodes',
    Keywords = 'Setting:Keywords',
    StockKeywordMap = 'Setting:Keywords:StockMap',
}

/**
 * Korea Investment 관련 설정을 Redis로 관리하는 헬퍼 서비스
 */
@Injectable()
export class KoreaInvestmentSettingHelperService {
    constructor(private readonly redisHelper: RedisHelper) {}

    /**
     * 설정용 Redis Set 인스턴스를 가져옵니다.
     * @param key
     */
    public getSettingSet(...key: (KoreaInvestmentSettingKey | string)[]) {
        return this.redisHelper.createSet(...key);
    }
}
