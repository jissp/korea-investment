import { Injectable, Logger } from '@nestjs/common';
import { Nullable } from '@common/types';
import { RedisHelper, RedisService } from '@modules/redis';
import {
    KoreaInvestmentDailyItemChartPrice,
    KoreaInvestmentHtsTopViewItem,
    KoreaInvestmentPopulatedHtsTopViewItem,
    KoreaInvestmentPopulatedVolumeRankItem,
    KoreaInvestmentStockInvestor,
    KoreaInvestmentVolumeRankItem,
    StockRepositoryRedisKey,
} from './stock-repository.types';

@Injectable()
export class StockRepository {
    private readonly logger = new Logger(StockRepository.name);

    constructor(
        private readonly redisService: RedisService,
        private readonly redisHelper: RedisHelper,
    ) {}

    private async getData<T>(key: string, defaultValue: T): Promise<T> {
        return this.redisService.getOrDefaultValue<T>(key, defaultValue);
    }

    private async setData<T>(
        key: string,
        data: T,
        ttl: number | null = null,
    ): Promise<boolean> {
        return this.redisService.set(key, JSON.stringify(data), {
            seconds: ttl,
        });
    }

    /**
     * 수집한 HTS조회상위20종목 정보를 응답합니다.
     */
    public async getHtsTopView() {
        return this.getData<KoreaInvestmentHtsTopViewItem[]>(
            StockRepositoryRedisKey.KoreaInvestmentHtsTopView,
            [],
        );
    }

    /**
     * HTS조회상위20종목 정보를 저장합니다.
     * @param data
     */
    public async setHtsTopView(data: KoreaInvestmentHtsTopViewItem[]) {
        return this.setData(
            StockRepositoryRedisKey.KoreaInvestmentHtsTopView,
            data,
            null,
        );
    }

    /**
     * 수집한 거래량순위를 응답합니다.
     */
    public async getVolumeRank() {
        return this.getData<KoreaInvestmentVolumeRankItem[]>(
            StockRepositoryRedisKey.KoreaInvestmentVolumeRank,
            [],
        );
    }

    /**
     * 거래량순위를 저장합니다.
     * @param data
     */
    public async setVolumeRank(data: KoreaInvestmentVolumeRankItem[]) {
        return this.setData(
            StockRepositoryRedisKey.KoreaInvestmentVolumeRank,
            data,
            null,
        );
    }

    /**
     * 수집한 HTS조회상위20종목을 응답합니다. (멀티종목 시세 조회 응답 결과 포함)
     */
    public async getPopulatedHtsTopView() {
        return this.getData<KoreaInvestmentPopulatedHtsTopViewItem[]>(
            StockRepositoryRedisKey.KoreaInvestmentPopulatedHtsTopView,
            [],
        );
    }

    /**
     * HTS조회상위20종목을 저장합니다. (멀티종목 시세 조회 응답 결과 포함)
     * @param data
     */
    public async setPopulatedHtsTopView(
        data: KoreaInvestmentPopulatedHtsTopViewItem[],
    ) {
        return this.setData(
            StockRepositoryRedisKey.KoreaInvestmentPopulatedHtsTopView,
            data,
            null,
        );
    }

    /**
     * 수집한 거래량순위를 응답합니다. (멀티종목 시세 조회 응답 결과 포함)
     */
    public async getPopulatedVolumeRank() {
        return this.getData<KoreaInvestmentPopulatedVolumeRankItem[]>(
            StockRepositoryRedisKey.KoreaInvestmentPopulatedVolumeRank,
            [],
        );
    }

    /**
     * 거래량순위를 저장합니다. (멀티종목 시세 조회 응답 결과 포함)
     * @param data
     */
    public async setPopulatedVolumeRank(
        data: KoreaInvestmentPopulatedVolumeRankItem[],
    ) {
        return this.setData(
            StockRepositoryRedisKey.KoreaInvestmentPopulatedVolumeRank,
            data,
            null,
        );
    }

    /**
     * 종목 시세를 저장합니다.
     * @param iscd
     * @param data
     */
    public async setDailyStockChart(
        iscd: string,
        data: KoreaInvestmentDailyItemChartPrice,
    ) {
        return this.setData(
            `${StockRepositoryRedisKey.DailyStockChart}:${iscd}`,
            data,
            60 * 60 * 2,
        );
    }

    /**
     * 종목 시세를 조회합니다.
     * @param stockCode
     */
    public async getDailyStockChart(stockCode: string) {
        return this.getData<Nullable<KoreaInvestmentDailyItemChartPrice>>(
            `${StockRepositoryRedisKey.DailyStockChart}:${stockCode}`,
            null,
        );
    }

    /**
     * 종목 투자자 정보를 저장합니다.
     * Hash와 ZSet에 동시에 저장하여 날짜 기반 조회를 지원합니다.
     * @param stockCode
     * @param data
     */
    public async setDailyInvestor(
        stockCode: string,
        data: KoreaInvestmentStockInvestor[],
    ) {
        try {
            const set = this.getStockInvestorSet(stockCode);
            const zSet = this.getStockInvestorZSet(stockCode);

            const promises = data.map(async (item) => {
                const date = item.date;

                const isExists = await set.exists(date);
                if (isExists) {
                    return;
                }

                // 날짜값을 Set에 등록
                const hashResult = await set.add(date);

                // ZSet에 timestamp를 score로 사용하여 저장
                const zsetResult = await zSet.add(
                    JSON.stringify(item),
                    new Date(date).getTime(),
                );

                return hashResult && zsetResult;
            });

            await Promise.all(promises);

            return true;
        } catch (error) {
            this.logger.error(error);

            return false;
        }
    }

    /**
     * 종목 투자자 정보를 날짜 순으로 조회합니다.
     * @param stockCode
     * @param limit - 조회할 최대 개수 (기본값: 100)
     */
    public async getDailyInvestorList(
        stockCode: string,
        limit: number = 100,
    ): Promise<KoreaInvestmentStockInvestor[]> {
        return this.getStockInvestorZSet(stockCode).list(limit, {
            isParse: true,
        });
    }

    /**
     * 종목 투자자 정보 Hash를 가져옵니다.
     * @param stockCode
     * @private
     */
    private getStockInvestorSet(stockCode: string) {
        return this.redisHelper.createSet(
            StockRepositoryRedisKey.Stocks,
            stockCode,
            'daily-investor',
            'set',
        );
    }

    /**
     * 종목 투자자 정보 ZSet을 가져옵니다.
     * @param stockCode
     * @private
     */
    private getStockInvestorZSet(stockCode: string) {
        return this.redisHelper.createZSet<KoreaInvestmentStockInvestor>(
            StockRepositoryRedisKey.Stocks,
            stockCode,
            'daily-investor',
        );
    }
}
