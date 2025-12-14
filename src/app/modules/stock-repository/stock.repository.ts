import { Cluster } from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';
import { RedisConnection, RedisService } from '@modules/redis';
import {
    KoreaInvestmentHtsTopViewItem,
    KoreaInvestmentNewsItem,
    KoreaInvestmentPopulatedHtsTopViewItem,
    KoreaInvestmentPopulatedVolumeRankItem,
    KoreaInvestmentVolumeRankItem,
    StockPlusNewsItem,
} from './stock-repository.types';

enum StockRepositoryKey {
    KoreaInvestmentHtsTopView = 'KoreaInvestmentHtsTopView',
    KoreaInvestmentVolumeRank = 'KoreaInvestmentVolumeRank',
    KoreaInvestmentPopulatedHtsTopView = 'KoreaInvestmentPopulatedHtsTopView',
    KoreaInvestmentPopulatedVolumeRank = 'KoreaInvestmentPopulatedVolumeRank',
    KoreaInvestmentNews = 'KoreaInvestmentNews',
    StockPlusNews = 'StockPlusNews',
}

@Injectable()
export class StockRepository {
    constructor(
        private readonly redisService: RedisService,
        @Inject(RedisConnection) private readonly redisClient: Cluster,
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
     * 수집한 한국투자증권의 뉴스 정보를 응답합니다.
     */
    public async getKoreaInvestmentNews() {
        return this.getData<KoreaInvestmentNewsItem[]>(
            StockRepositoryKey.KoreaInvestmentNews,
            [],
        );
    }

    /**
     * 한국투자증권의 뉴스 정보를 저장합니다.
     * @param data
     */
    public async setKoreaInvestmentNews(data: KoreaInvestmentNewsItem[]) {
        return this.setData(StockRepositoryKey.KoreaInvestmentNews, data, null);
    }

    /**
     * 수집한 증권 플러스의 뉴스 정보를 응답합니다.
     */
    public async getStockPlusNews() {
        return this.getData<StockPlusNewsItem[]>(
            StockRepositoryKey.StockPlusNews,
            [],
        );
    }

    /**
     * 증권 플러스의 뉴스 정보를 저장합니다.
     * @param data
     */
    public async setStockPlusNews(data: StockPlusNewsItem[]) {
        return this.setData(StockRepositoryKey.StockPlusNews, data, null);
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
}
