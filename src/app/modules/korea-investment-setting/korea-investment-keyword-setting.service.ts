import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RedisHelper, RedisSet } from '@modules/redis';
import { getStockName } from '@common/domains';
import {
    KeywordType,
    KoreaInvestmentKeywordSettingEvent,
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
        private readonly eventEmitter: EventEmitter2,
        @Inject('KeywordSetMap')
        private readonly keywordSetMap: Map<KeywordType, RedisSet>,
    ) {}

    /**
     * 키워드 그룹 목록을 조회합니다.
     */
    public async getKeywordGroupsList(): Promise<string[]> {
        return this.getKeywordGroupsSet().list();
    }

    /**
     * 키워드가 속한 키워드 그룹 목록을 조회합니다.
     */
    public async getKeywordGroupsListByKeyword(
        keyword: string,
    ): Promise<string[]> {
        return this.getKeywordGroupsByKeywordSet(keyword).list();
    }

    /**
     * 키워드 그룹을 생성합니다.
     * @param groupName
     */
    public async createKeywordGroup(groupName: string) {
        return this.getKeywordGroupsSet().add(groupName);
    }

    /**
     * 키워드 그룹을 삭제합니다.
     * @param groupName
     */
    public async deleteKeywordGroup(groupName: string) {
        const keywords = await this.getKeywordsByGroup(groupName);

        await this.getKeywordGroupItemSet(groupName).clear();

        await this.getKeywordGroupsSet().remove(groupName);

        this.eventEmitter.emit(
            KoreaInvestmentKeywordSettingEvent.DeletedKeywordGroup,
            { groupName, keywords },
        );
    }

    /**
     * 그룹 내 키워드 목록을 조회합니다.
     * @param groupName
     */
    public async getKeywordsByGroup(groupName: string): Promise<string[]> {
        return this.getKeywordGroupItemSet(groupName).list();
    }

    /**
     * 키워드 그룹이 지정된 모든 키워드를 조회합니다.
     */
    public async getKeywordsFromAllGroups(): Promise<string[]> {
        const groupNames = await this.getKeywordGroupsList();

        const results = await Promise.all(
            groupNames.map((groupName) => this.getKeywordsByGroup(groupName)),
        );

        return Array.from(new Set(results.flat()));
    }

    /**
     * 그룹에 키워드를 추가합니다.
     * @param groupName
     * @param keyword
     */
    public async addKeywordToGroup(groupName: string, keyword: string) {
        await this.createKeywordGroup(groupName);

        const result =
            await this.getKeywordGroupItemSet(groupName).add(keyword);

        this.eventEmitter.emit(
            KoreaInvestmentKeywordSettingEvent.AddedKeywordToGroup,
            { groupName, keyword },
        );

        return result;
    }

    /**
     * 그룹에 종목명(키워드)을 추가합니다.
     * @param groupName
     * @param stockCode
     */
    public async addStockToGroup(groupName: string, stockCode: string) {
        const stockName = getStockName(stockCode);

        return this.addKeywordToGroup(groupName, stockName);
    }

    /**
     * 그룹에서 키워드를 삭제합니다.
     * @param groupName
     * @param keyword
     */
    public async deleteKeywordFromGroup(groupName: string, keyword: string) {
        const result =
            await this.getKeywordGroupItemSet(groupName).remove(keyword);

        this.eventEmitter.emit(
            KoreaInvestmentKeywordSettingEvent.DeletedKeywordFromGroup,
            { groupName, keyword },
        );

        return result;
    }

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
    public async getKeywordsByStockCode(stockCode: string): Promise<string[]> {
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

    /**
     * 키워드가 속해있는 키워드 그룹 목록 Set을 반환합니다.
     * @param keyword
     * @private
     */
    private getKeywordGroupsByKeywordSet(keyword: string) {
        return this.redisHelper.createSet(
            KoreaInvestmentKeywordSettingKey.KeywordGroupsByKeyword,
            keyword,
        );
    }

    /**
     * 키워드 그룹 목록 Set을 반환합니다.
     * @private
     */
    private getKeywordGroupsSet() {
        return this.redisHelper.createSet(
            KoreaInvestmentKeywordSettingKey.KeywordGroups,
        );
    }

    /**
     * 특정 키워드 그룹의 키워드 Set을 반환합니다.
     * @param groupName
     * @private
     */
    private getKeywordGroupItemSet(groupName: string) {
        return this.redisHelper.createSet(
            `${KoreaInvestmentKeywordSettingKey.KeywordGroups}:${groupName}`,
        );
    }
}
