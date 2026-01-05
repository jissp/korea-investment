import { Inject, Injectable, Logger } from '@nestjs/common';
import { RedisHelper, RedisSet } from '@modules/redis';
import {
    KeywordType,
    KoreaInvestmentKeywordSettingKey,
} from './korea-investment-keyword-setting.types';

type KeywordWithStockCodeArgs = {
    keyword: string;
    stockCode: string;
};

@Injectable()
export class KoreaInvestmentKeywordSettingService {
    private readonly logger = new Logger(
        KoreaInvestmentKeywordSettingService.name,
    );

    constructor(
        private readonly redisHelper: RedisHelper,
        @Inject('KeywordSetMap')
        private readonly keywordSetMap: Map<KeywordType, RedisSet>,
    ) {}

    /**
     * 키워드 목록을 조회합니다.
     */
    public async getKeywords(
        keywordTypes: KeywordType[] = Object.values(KeywordType),
    ): Promise<string[]> {
        const keywordGroups = await Promise.all(
            keywordTypes.map((type) => this.getKeywordsByType(type)),
        );

        const keywords = keywordGroups.flat();
        if (!keywords.length) {
            return [];
        }

        return Array.from(new Set(keywords));
    }

    /**
     * 타입에 맞는 키워드 목록을 조회합니다.
     * @param type
     */
    public async getKeywordsByType(type: KeywordType) {
        return this.getKeywordSetByType(type).list();
    }

    /**
     * 타입에 맞는 키워드를 추가합니다.
     * @param type
     * @param keyword
     */
    public async addKeywordByType(type: KeywordType, ...keyword: string[]) {
        return this.getKeywordSetByType(type).add(...keyword);
    }

    /**
     * 타입에 맞는 키워드를 삭제합니다.
     * @param type
     * @param keyword
     */
    public async deleteKeywordByType(type: KeywordType, ...keyword: string[]) {
        return this.getKeywordSetByType(type).remove(...keyword);
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
    public async addKeywordToStock({
        stockCode,
        keyword,
    }: KeywordWithStockCodeArgs) {
        const stockKeywordSet = this.getKeywordsByStockSet(stockCode);

        return stockKeywordSet.add(keyword);
    }

    /**
     * 종목에 등록된 키워드를 삭제합니다.
     * @param stockCode
     * @param keyword
     */
    public async deleteKeywordFromStock({
        stockCode,
        keyword,
    }: KeywordWithStockCodeArgs) {
        const stockKeywordSet = this.getKeywordsByStockSet(stockCode);

        return stockKeywordSet.remove(keyword);
    }

    /**
     * 종목 키워드 키를 삭제합니다.
     * @param stockCode
     */
    public async clearKeywordByStock(stockCode: string) {
        const stockKeywordSet = this.getKeywordsByStockSet(stockCode);

        return stockKeywordSet.clear();
    }

    /**
     * 키워드에 등록된 종목들을 조회합니다.
     * @param keyword
     */
    public async getStockCodesByKeyword(keyword: string) {
        const stockKeywordMapSet = this.getStocksByKeywordSet(keyword);

        return stockKeywordMapSet.list();
    }

    /**
     * @param keyword
     * @param stockCode
     */
    public async addKeywordWithStockCodeMap({
        keyword,
        stockCode,
    }: KeywordWithStockCodeArgs) {
        return Promise.all([
            this.addStockCodeToKeyword({
                keyword: keyword,
                stockCode: stockCode,
            }),
            this.addKeywordToStock({ stockCode: stockCode, keyword: keyword }),
        ]);
    }

    /**
     * 키워드에 종목을 추가합니다.
     * @param keyword
     * @param stockCode
     */
    public async addStockCodeToKeyword({
        keyword,
        stockCode,
    }: KeywordWithStockCodeArgs) {
        const stockKeywordMapSet = this.getStocksByKeywordSet(keyword);

        return stockKeywordMapSet.add(stockCode);
    }

    /**
     * 키워드에 등록된 종목을 제거합니다.
     * @param keyword
     * @param stockCode
     */
    public async deleteStockCodeFromKeyword({
        keyword,
        stockCode,
    }: KeywordWithStockCodeArgs) {
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
            KoreaInvestmentKeywordSettingKey.StocksByKeyword,
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
            KoreaInvestmentKeywordSettingKey.KeywordsByStock,
            stockCode,
        );
    }

    /**
     * 타입에 맞는 키워드 RedisSet을 반환합니다.
     * @param type
     * @private
     */
    private getKeywordSetByType(type: KeywordType): RedisSet {
        if (!this.keywordSetMap.has(type)) {
            throw new Error('Invalid Keyword Type');
        }

        return this.keywordSetMap.get(type)!;
    }
}
