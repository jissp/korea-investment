import { Injectable } from '@nestjs/common';
import { Nullable } from '@common/types';
import { RedisService } from '@modules/redis';
import {
    KoreaInvestmentDailyItemChartPrice,
    KoreaInvestmentHtsTopViewItem,
    KoreaInvestmentPopulatedHtsTopViewItem,
    KoreaInvestmentPopulatedVolumeRankItem,
    KoreaInvestmentVolumeRankItem,
} from './stock-repository.types';

enum StockRepositoryKey {
    KoreaInvestmentHtsTopView = 'KoreaInvestmentHtsTopView',
    KoreaInvestmentVolumeRank = 'KoreaInvestmentVolumeRank',
    KoreaInvestmentPopulatedHtsTopView = 'KoreaInvestmentPopulatedHtsTopView',
    KoreaInvestmentPopulatedVolumeRank = 'KoreaInvestmentPopulatedVolumeRank',
    DailyStockChart = 'DailyStockChart',
}

@Injectable()
export class StockRepository {
    constructor(private readonly redisService: RedisService) {}

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
            StockRepositoryKey.KoreaInvestmentHtsTopView,
            [],
        );
    }

    /**
     * HTS조회상위20종목 정보를 저장합니다.
     * @param data
     */
    public async setHtsTopView(data: KoreaInvestmentHtsTopViewItem[]) {
        return this.setData(
            StockRepositoryKey.KoreaInvestmentHtsTopView,
            data,
            null,
        );
    }

    /**
     * 수집한 거래량순위를 응답합니다.
     */
    public async getVolumeRank() {
        return this.getData<KoreaInvestmentVolumeRankItem[]>(
            StockRepositoryKey.KoreaInvestmentVolumeRank,
            [],
        );
    }

    /**
     * 거래량순위를 저장합니다.
     * @param data
     */
    public async setVolumeRank(data: KoreaInvestmentVolumeRankItem[]) {
        return this.setData(
            StockRepositoryKey.KoreaInvestmentVolumeRank,
            data,
            null,
        );
    }

    /**
     * 수집한 HTS조회상위20종목을 응답합니다. (멀티종목 시세 조회 응답 결과 포함)
     */
    public async getPopulatedHtsTopView() {
        return this.getData<KoreaInvestmentPopulatedHtsTopViewItem[]>(
            StockRepositoryKey.KoreaInvestmentPopulatedHtsTopView,
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
            StockRepositoryKey.KoreaInvestmentPopulatedHtsTopView,
            data,
            null,
        );
    }

    /**
     * 수집한 거래량순위를 응답합니다. (멀티종목 시세 조회 응답 결과 포함)
     */
    public async getPopulatedVolumeRank() {
        return this.getData<KoreaInvestmentPopulatedVolumeRankItem[]>(
            StockRepositoryKey.KoreaInvestmentPopulatedVolumeRank,
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
            StockRepositoryKey.KoreaInvestmentPopulatedVolumeRank,
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
            `${StockRepositoryKey.DailyStockChart}:${iscd}`,
            data,
            60 * 60 * 2,
        );
    }

    /**
     * 종목 시세를 조회합니다.
     * @param iscd
     */
    public async getDailyStockChart(iscd: string) {
        return this.getData<Nullable<KoreaInvestmentDailyItemChartPrice>>(
            `${StockRepositoryKey.DailyStockChart}:${iscd}`,
            null,
        );
    }
}
