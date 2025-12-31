import { Inject, Injectable, Logger } from '@nestjs/common';
import { RedisHelper, RedisService, RedisSet } from '@modules/redis';
import { KoreaInvestmentSettingKey } from './korea-investment-setting.types';
import { StockCodeType } from './korea-investment-keyword-setting.types';

@Injectable()
export class KoreaInvestmentSettingService {
    private readonly logger = new Logger(KoreaInvestmentSettingService.name);

    private readonly accountSet: RedisSet;

    constructor(
        private readonly redisHelper: RedisHelper,
        private readonly redisService: RedisService,
        @Inject('StockCodeSetMap')
        private readonly stockCodeSetMap: Map<StockCodeType, RedisSet>,
    ) {
        this.accountSet = redisHelper.createSet(
            KoreaInvestmentSettingKey.Accounts,
        );
    }

    /**
     * 계좌 목록을 조회합니다.
     */
    public async getAccountNumbers() {
        return this.accountSet.list();
    }

    /**
     * 타입에 맞는 종목 코드 RedisSet을 반환합니다.
     * @param type
     * @private
     */
    private getStockCodeSetByType(type: StockCodeType): RedisSet {
        if (!this.stockCodeSetMap.has(type)) {
            throw new Error('Invalid StockCode Type');
        }

        return this.stockCodeSetMap.get(type)!;
    }

    /**
     * 종목 코드 목록을 설정합니다.
     * @param stockCodes
     */
    public async setStockCodes(stockCodes: string[]) {
        return this.redisService.set(
            KoreaInvestmentSettingKey.StockCodes,
            JSON.stringify(stockCodes),
        );
    }

    /**
     * 종목 코드 목록을 조회합니다.
     */
    public async getStockCodes(): Promise<string[]> {
        const stockCodes = await this.redisService.get(
            KoreaInvestmentSettingKey.StockCodes,
        );
        if (!stockCodes) {
            return [];
        }

        try {
            return JSON.parse(stockCodes) as string[];
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     * 타입에 맞는 종목 코드 목록을 조회합니다.
     * @param type
     */
    public async getStockCodesByType(type: StockCodeType) {
        return this.getStockCodeSetByType(type).list();
    }

    /**
     * 타입에 맞는 종목 코드를 추가합니다.
     * @param type
     * @param stockCode
     */
    public async addStockCodeByType(type: StockCodeType, stockCode: string) {
        return this.getStockCodeSetByType(type).add(stockCode);
    }

    /**
     * 타입에 맞는 종목 코드를 삭제합니다.
     * @param type
     * @param stockCode
     */
    public async deleteStockCodeByType(type: StockCodeType, stockCode: string) {
        return this.getStockCodeSetByType(type).remove(stockCode);
    }
}
