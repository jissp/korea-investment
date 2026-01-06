import { Injectable, Logger } from '@nestjs/common';
import { RedisHelper } from '@modules/redis';
import {
    AiAnalysisKeywordGroup,
    AiAnalysisStock,
    KoreaInvestmentAnalysisKey,
} from './analysis-repository.types';
import { Nullable } from '@common/types';

@Injectable()
export class AnalysisRepository {
    private readonly logger = new Logger(AnalysisRepository.name);

    constructor(private readonly redisHelper: RedisHelper) {}

    /**
     * 종목에 대한 AI 분석 결과를 저장합니다.
     * @param aiAnalysisStock
     */
    public async setAIAnalysisStock(aiAnalysisStock: AiAnalysisStock) {
        const hash = this.getAnalysisStocksFromAiHash();

        return hash.add(
            aiAnalysisStock.stockCode,
            JSON.stringify(aiAnalysisStock),
        );
    }

    /**
     * 종목에 대한 AI 분석 결과를 조회합니다.
     * @param stockCode
     */
    public async getAIAnalysisStock(
        stockCode: string,
    ): Promise<Nullable<AiAnalysisStock>> {
        try {
            const hash = this.getAnalysisStocksFromAiHash();

            return hash.get(stockCode, {
                isParse: true,
            });
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    /**
     * 종목에 대한 AI 분석 결과 목록을 조회합니다.
     */
    public async getAIAnalysisStocks(): Promise<AiAnalysisStock[]> {
        try {
            const hash = this.getAnalysisStocksFromAiHash();

            return hash.list({
                isParse: true,
            });
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    /**
     * 키워드 그룹에 대한 AI 분석 결과를 저장합니다.
     * @param aiAnalysisKeywordGroup
     */
    public async setAIAnalysisKeywordGroup(
        aiAnalysisKeywordGroup: AiAnalysisKeywordGroup,
    ) {
        const hash = this.getAnalysisKeywordGroupsFromAiHash();

        return hash.add(
            aiAnalysisKeywordGroup.groupName,
            JSON.stringify(aiAnalysisKeywordGroup),
        );
    }

    /**
     * 종목에 대한 AI 분석 결과를 조회합니다.
     * @param groupName
     */
    public async getAIAnalysisKeywordGroup(
        groupName: string,
    ): Promise<Nullable<AiAnalysisKeywordGroup>> {
        try {
            const hash = this.getAnalysisKeywordGroupsFromAiHash();

            return hash.get(groupName, {
                isParse: true,
            });
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    /**
     * 종목에 대한 AI 분석 결과 목록을 조회합니다.
     */
    public async getAIAnalysisKeywordGroups(): Promise<
        AiAnalysisKeywordGroup[]
    > {
        try {
            const hash = this.getAnalysisKeywordGroupsFromAiHash();

            return hash.list({
                isParse: true,
            });
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    /**
     * 종목 AI 분석 결과를 저장하는 Hash를 생성합니다.
     */
    private getAnalysisStocksFromAiHash() {
        return this.redisHelper.createHash<AiAnalysisStock>(
            KoreaInvestmentAnalysisKey.AiAnalysisStocks,
        );
    }

    /**
     * 키워드 AI 분석 결과를 저장하는 Hash를 생성합니다.
     */
    private getAnalysisKeywordGroupsFromAiHash() {
        return this.redisHelper.createHash<AiAnalysisKeywordGroup>(
            KoreaInvestmentAnalysisKey.AiAnalysisKeywordGroups,
        );
    }
}
