import { Inject, Injectable, Logger } from '@nestjs/common';
import { RedisHelper, RedisService, RedisSet } from '@modules/redis';
import {
    KeywordType,
    KoreaInvestmentKeywordSettingKey,
} from './korea-investment-keyword-setting.types';

@Injectable()
export class KoreaInvestmentKeywordSettingService {
    private readonly logger = new Logger(
        KoreaInvestmentKeywordSettingService.name,
    );

    constructor(
        private readonly redisHelper: RedisHelper,
        private readonly redisService: RedisService,
        @Inject('KeywordSetMap')
        private readonly keywordSetMap: Map<KeywordType, RedisSet>,
    ) {}

    /**
     * 키워드 목록을 설정합니다.
     * @param keywords
     */
    public async setKeywords(keywords: string[]) {
        return this.redisService.set(
            KoreaInvestmentKeywordSettingKey.Keywords,
            JSON.stringify(keywords),
        );
    }

    /**
     * 키워드 목록을 조회합니다.
     */
    public async getKeywords(): Promise<string[]> {
        const keywords = await this.redisService.get(
            KoreaInvestmentKeywordSettingKey.Keywords,
        );
        if (!keywords) {
            return [];
        }

        try {
            return JSON.parse(keywords);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
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
    public async addKeywordsByType(type: KeywordType, keyword: string) {
        return this.getKeywordSetByType(type).add(keyword);
    }

    /**
     * 타입에 맞는 키워드를 삭제합니다.
     * @param type
     * @param keyword
     */
    public async deleteKeywordsByType(type: KeywordType, keyword: string) {
        return this.getKeywordSetByType(type).remove(keyword);
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

        return stockKeywordSet.remove(keyword);
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
