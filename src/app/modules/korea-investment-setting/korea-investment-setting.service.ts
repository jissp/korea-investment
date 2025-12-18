import { Injectable } from '@nestjs/common';
import { RedisHelper, RedisSet } from '@modules/redis';
import { KoreaInvestmentSettingKey } from './korea-investment-setting.types';

@Injectable()
export class KoreaInvestmentSettingService {
    private readonly keywordSet: RedisSet;
    private readonly stockCodeSet: RedisSet;

    constructor(private readonly redisHelper: RedisHelper) {
        this.keywordSet = redisHelper.createSet(
            KoreaInvestmentSettingKey.Keywords,
        );
        this.stockCodeSet = redisHelper.createSet(
            KoreaInvestmentSettingKey.StockCodes,
        );
    }

    /**
     * 키워드 목록을 조회합니다.
     */
    public async getKeywords() {
        return this.keywordSet.list();
    }

    /**
     * 키워드를 등록합니다.
     * @param keyword
     */
    public async addKeyword(keyword: string) {
        return this.keywordSet.add(keyword);
    }

    /**
     * 키워드를 삭제합니다.
     * @param keyword
     */
    public async deleteKeyword(keyword: string) {
        return this.keywordSet.remove(keyword);
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

    /**
     * 종목에 등록된 키워드를 조회합니다.
     * @param stockCode
     */
    public async getKeywordsByStockCode(stockCode: string) {
        const stockKeywordMapSet = this.getKeywordsByStockSet(stockCode);

        return stockKeywordMapSet.list();
    }

    /**
     * 종목에 키워드를 등록합니다.
     * @param stockCode
     * @param keyword
     */
    public async addKeywordToStock(stockCode: string, keyword: string) {
        const stockKeywordSet = this.getKeywordsByStockSet(stockCode);

        return stockKeywordSet.add(keyword);
    }

    /**
     * 종목에 등록된 키워드를 삭제합니다.
     * @param stockCode
     * @param keyword
     */
    public async deleteKeywordFromStock(stockCode: string, keyword: string) {
        const stockKeywordSet = this.getKeywordsByStockSet(stockCode);

        return await stockKeywordSet.remove(keyword);
    }

    /**
     * 키워드에 등록된 종목들을 조회합니다.
     * @param keyword
     */
    public async getStockCodesFromKeyword(keyword: string) {
        const stockKeywordMapSet = this.getStocksByKeywordSet(keyword);

        return stockKeywordMapSet.list();
    }

    /**
     * 키워드에 종목을 추가합니다.
     * @param keyword
     * @param stockCode
     */
    public async addStockCodeToKeyword(keyword: string, stockCode: string) {
        const stockKeywordMapSet = this.getStocksByKeywordSet(keyword);

        return stockKeywordMapSet.add(stockCode);
    }

    /**
     * 키워드에 등록된 종목을 제거합니다.
     * @param keyword
     * @param stockCode
     */
    public async deleteStockCodeFromKeyword(
        keyword: string,
        stockCode: string,
    ) {
        const stockKeywordMapSet = this.getStocksByKeywordSet(keyword);

        return stockKeywordMapSet.remove(stockCode);
    }

    /**
     * 종목 키워드 맵에 등록된 stockCode의 갯수를 조회합니다.
     * @param keyword
     */
    public async getStockCodeCountFromKeyword(keyword: string) {
        const stockKeywordMapSet = this.getStocksByKeywordSet(keyword);

        return stockKeywordMapSet.count();
    }

    /**
     * 키워드별 종목 Set을 조회합니다.
     * @param keyword
     */
    private getStocksByKeywordSet(keyword: string) {
        return this.redisHelper.createSet(
            KoreaInvestmentSettingKey.StocksByKeyword,
            keyword,
        );
    }

    /**
     * 종목별 키워드 Set을 생성합니다.
     * @param stockCode
     * @private
     */
    private getKeywordsByStockSet(stockCode: string) {
        return this.redisHelper.createSet(
            KoreaInvestmentSettingKey.KeywordsByStock,
            stockCode,
        );
    }
}
