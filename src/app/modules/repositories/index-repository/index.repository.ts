import { Injectable, Logger } from '@nestjs/common';
import { Nullable } from '@common/types';
import {
    getRedisKey,
    RedisHash,
    RedisHelper,
    RedisService,
    RedisZset,
} from '@modules/redis';
import {
    DomesticDailyIndexItem,
    DomesticIndexItem,
    IndexRepositoryRedisKey,
    OverseasDailyGovernmentBondItem,
    OverseasDailyIndexItem,
    OverseasGovernmentBondItem,
    OverseasIndexItem,
} from './index-repository.types';

@Injectable()
export class IndexRepository {
    private readonly logger = new Logger(IndexRepository.name);

    constructor(
        private readonly redisHelper: RedisHelper,
        private readonly redisService: RedisService,
    ) {}

    /**
     * 국내업종 일자별 지수 Hash를 생성합니다.
     * @param code
     * @private
     */
    private getDomesticDailyIndexHash(
        code: string,
    ): RedisHash<DomesticDailyIndexItem> {
        return this.redisHelper.createHash<DomesticDailyIndexItem>(
            IndexRepositoryRedisKey.DomesticDailyIndex,
            code,
        );
    }

    /**
     * 국내업종 일자별 지수 zSet를 생성합니다.
     * @param code
     * @private
     */
    private getDomesticDailyIndexZSet(
        code: string,
    ): RedisZset<DomesticDailyIndexItem> {
        return this.redisHelper.createZSet<DomesticDailyIndexItem>(
            IndexRepositoryRedisKey.DomesticDailyIndexScore,
            code,
        );
    }

    /**
     * 해외업종 일자별 지수 Hash를 생성합니다.
     * @param code
     * @private
     */
    private getOverseasDailyIndexHash(
        code: string,
    ): RedisHash<OverseasDailyIndexItem> {
        return this.redisHelper.createHash<OverseasDailyIndexItem>(
            IndexRepositoryRedisKey.OverseasDailyIndex,
            code,
        );
    }

    /**
     * 해외업종 일자별 지수 zSet를 생성합니다.
     * @param code
     * @private
     */
    private getOverseasDailyIndexZSet(
        code: string,
    ): RedisZset<OverseasDailyIndexItem> {
        return this.redisHelper.createZSet<OverseasDailyIndexItem>(
            IndexRepositoryRedisKey.OverseasDailyIndexScore,
            code,
        );
    }

    /**
     * 해외업종 일자별 국채 지수 Hash를 생성합니다.
     * @param code
     * @private
     */
    private getOverseasDailyGovernmentBondHash(
        code: string,
    ): RedisHash<OverseasDailyGovernmentBondItem> {
        return this.redisHelper.createHash<OverseasDailyGovernmentBondItem>(
            IndexRepositoryRedisKey.OverseasDailyGovernmentBond,
            code,
        );
    }

    /**
     * 해외업종 일자별 국채 지수 zSet를 생성합니다.
     * @param code
     * @private
     */
    private getOverseasDailyGovernmentBondZSet(
        code: string,
    ): RedisZset<OverseasDailyGovernmentBondItem> {
        return this.redisHelper.createZSet<OverseasDailyGovernmentBondItem>(
            IndexRepositoryRedisKey.OverseasDailyGovernmentBondScore,
            code,
        );
    }

    /**
     * 국내업종 현재지수를 저장합니다.
     * @param code
     * @param index
     */
    public async setDomesticIndex(code: string, index: DomesticIndexItem) {
        return this.redisService.set(
            getRedisKey(IndexRepositoryRedisKey.DomesticIndex, code),
            JSON.stringify(index),
        );
    }

    /**
     * 국내업종 현재지수를 조회합니다.
     * @param code
     */
    public async getDomesticIndex(
        code: string,
    ): Promise<Nullable<DomesticIndexItem>> {
        const index = await this.redisService.get(
            getRedisKey(IndexRepositoryRedisKey.DomesticIndex, code),
        );

        if (!index) {
            return null;
        }

        try {
            return JSON.parse(index) as DomesticIndexItem;
        } catch {
            this.logger.error(`Index JSON parse error: ${index}`);

            return null;
        }
    }

    /**
     * 국내업종 일자별 지수를 저장합니다.
     * @param code
     * @param index
     */
    public async setDomesticDailyIndex(
        code: string,
        index: DomesticDailyIndexItem,
    ) {
        const hash = this.getDomesticDailyIndexHash(code);
        const zSet = this.getDomesticDailyIndexZSet(code);

        return Promise.all([
            hash.add(index.date, JSON.stringify(index)),
            zSet.add(JSON.stringify(index), new Date(index.date).getTime()),
        ]);
    }

    /**
     * 국내업종 일자별 지수를 조회합니다.
     * @param code
     * @param date
     */
    public async getDomesticDailyIndex(
        code: string,
        date: string,
    ): Promise<Nullable<DomesticDailyIndexItem>> {
        const hash = this.getDomesticDailyIndexHash(code);

        return hash.get(date);
    }

    /**
     * 국내업종 일자별 지수 목록을 조회합니다.
     * @param code
     * @param limit
     */
    public async getDomesticDailyIndexes(
        code: string,
        limit: number = 30,
    ): Promise<DomesticDailyIndexItem[]> {
        const zSet = this.getDomesticDailyIndexZSet(code);

        return zSet.list(limit, {
            isParse: true,
        });
    }

    /**
     * 해외업종 현재지수를 저장합니다.
     * @param code
     * @param index
     */
    public async setOverseasIndex(code: string, index: OverseasIndexItem) {
        return this.redisService.set(
            getRedisKey(IndexRepositoryRedisKey.OverseasIndex, code),
            JSON.stringify(index),
        );
    }

    /**
     * 해외업종 현재지수를 조회합니다.
     * @param code
     */
    public async getOverseasIndex(
        code: string,
    ): Promise<Nullable<OverseasIndexItem>> {
        const index = await this.redisService.get(
            getRedisKey(IndexRepositoryRedisKey.OverseasIndex, code),
        );

        if (!index) {
            return null;
        }

        try {
            return JSON.parse(index) as OverseasIndexItem;
        } catch {
            this.logger.error(`Index JSON parse error: ${index}`);

            return null;
        }
    }

    /**
     * 해외업종 일자별 지수를 저장합니다.
     * @param code
     * @param index
     */
    public async setOverseasDailyIndex(
        code: string,
        index: OverseasDailyIndexItem,
    ) {
        const hash = this.getOverseasDailyIndexHash(code);
        const zSet = this.getOverseasDailyIndexZSet(code);

        return Promise.all([
            hash.add(index.date, JSON.stringify(index)),
            zSet.add(JSON.stringify(index), new Date(index.date).getTime()),
        ]);
    }

    /**
     * 해외 업종 일자별 시세를 조회합니다. (다우존스 산업지수, 나스닥, S&P500 등)
     */
    public async getOverseasDailyIndex(
        code: string,
        date: string,
    ): Promise<Nullable<OverseasDailyIndexItem>> {
        const hash = this.getOverseasDailyIndexHash(code);

        return hash.get(date);
    }

    /**
     * 해외 업종 일자별 시세 목록을 조회합니다. (다우존스 산업지수, 나스닥, S&P500 등)
     */
    public async getOverseasDailyIndexes(
        code: string,
        limit: number = 30,
    ): Promise<OverseasDailyIndexItem[]> {
        const zSet = this.getOverseasDailyIndexZSet(code);

        return zSet.list(limit);
    }

    /**
     * 해외업종 현재 국채 지수를 저장합니다.
     * @param code
     * @param index
     */
    public async setOverseasGovernmentBond(
        code: string,
        index: OverseasGovernmentBondItem,
    ) {
        return this.redisService.set(
            getRedisKey(IndexRepositoryRedisKey.OverseasGovernmentBond, code),
            JSON.stringify(index),
        );
    }

    /**
     * 해외업종 현재 국채 지수를 조회합니다.
     * @param code
     */
    public async getOverseasGovernmentBond(
        code: string,
    ): Promise<Nullable<OverseasGovernmentBondItem>> {
        const index = await this.redisService.get(
            getRedisKey(IndexRepositoryRedisKey.OverseasGovernmentBond, code),
        );

        if (!index) {
            return null;
        }

        try {
            return JSON.parse(index) as OverseasGovernmentBondItem;
        } catch {
            this.logger.error(`Index JSON parse error: ${index}`);

            return null;
        }
    }

    /**
     * 해외업종 일자별 국채 지수를 저장합니다.
     * @param code
     * @param index
     */
    public async setOverseasDailyGovernmentBond(
        code: string,
        index: OverseasDailyGovernmentBondItem,
    ) {
        const hash = this.getOverseasDailyGovernmentBondHash(code);
        const zSet = this.getOverseasDailyGovernmentBondZSet(code);

        return Promise.all([
            hash.add(index.date, JSON.stringify(index)),
            zSet.add(JSON.stringify(index), new Date(index.date).getTime()),
        ]);
    }

    /**
     * 해외 업종 일자별 시세를 조회합니다. (다우존스 산업지수, 나스닥, S&P500 등)
     */
    public async getOverseasDailyGovernmentBond(
        code: string,
        date: string,
    ): Promise<Nullable<OverseasDailyGovernmentBondItem>> {
        const hash = this.getOverseasDailyGovernmentBondHash(code);

        return hash.get(date);
    }

    /**
     * 해외 업종 일자별 시세 목록을 조회합니다. (다우존스 산업지수, 나스닥, S&P500 등)
     */
    public async getDailyGovernmentBonds(
        code: string,
        limit: number = 30,
    ): Promise<OverseasDailyGovernmentBondItem[]> {
        const zSet = this.getOverseasDailyGovernmentBondZSet(code);

        return zSet.list(limit);
    }
}
