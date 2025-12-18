import { Injectable } from '@nestjs/common';
import { RedisSet } from '@modules/redis';
import {
    KoreaInvestmentSettingHelperService,
    KoreaInvestmentSettingKey,
} from '@app/modules/korea-investment-setting';

@Injectable()
export class StockService {
    private readonly set: RedisSet;

    constructor(
        private readonly koreaInvestmentSettingHelperService: KoreaInvestmentSettingHelperService,
    ) {
        this.set = this.koreaInvestmentSettingHelperService.getSettingSet(
            KoreaInvestmentSettingKey.StockCodes,
        );
    }

    /**
     * 종목 코드를 응답합니다.
     */
    public async getStockCodes() {
        return this.set.list();
    }

    /**
     * 종목 코드가 존재하는지 확인합니다.
     * @param stockCode
     */
    public async existsStockCodes(stockCode: string) {
        return this.set.exists(stockCode);
    }

    /**
     * 종목 코드를 추가합니다.
     * @param stockCode
     */
    public async addStockCode(stockCode: string) {
        const isExists = await this.existsStockCodes(stockCode);
        if (isExists) {
            return true;
        }

        return this.set.add(stockCode);
    }

    /**
     * 종목 코드를 삭제합니다.
     * @param stockCode
     */
    public async deleteStockCode(stockCode: string) {
        const isExists = await this.existsStockCodes(stockCode);
        if (!isExists) {
            return true;
        }

        return this.set.remove(stockCode);
    }
}
