import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import {
    StockPlusAsset,
    StockPlusClient,
    StockPlusNews,
} from '@modules/stock-plus';
import { NewsCategory, NewsDto } from '@app/modules/repositories/news';
import {
    NewsStrategy,
    RequestCrawlingNewsJobPayload,
} from '../news-crawler.types';
import { BaseStrategy } from './base-strategy';

@Injectable()
export class StockPlusStrategy extends BaseStrategy<
    NewsStrategy.StockPlus,
    StockPlusNews
> {
    private readonly koreaStockPatternRegExp = /^A[0-9]{6}$/;

    private readonly stockCodeNormalizersByMarket: Record<
        string,
        (stockCode: string) => string
    > = {
        US: this.toNormalizeStockCodeByUsaStockCode.bind(this),
        KOREA: this.toNormalizeStockCodeByKoreaStockCode.bind(this),
    };

    private readonly logger = new Logger(StockPlusStrategy.name);

    constructor(private readonly stockPlusClient: StockPlusClient) {
        super();
    }

    protected async fetch(
        job: Job<RequestCrawlingNewsJobPayload<NewsStrategy.StockPlus>>,
    ): Promise<StockPlusNews[]> {
        try {
            const response = await this.stockPlusClient.getLatestNews(20);

            return response.data.breakingNews;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    protected transform(value: StockPlusNews): NewsDto {
        return {
            // TODO: Stock code 매핑 구현 필요
            // stockCodes: value.assets
            //     .map((asset) => this.mapAssetCodeToStockCode(asset))
            //     .filter(Boolean) as string[],
            articleId: value.id.toString(),
            category: NewsCategory.StockPlus,
            title: value.title,
            description: value.summaries[0],
            publishedAt: new Date(value.publishedAt),
        };
    }

    private mapAssetCodeToStockCode({ assetCode }: StockPlusAsset) {
        const marketCode = this.toMarketCode(assetCode);
        if (marketCode && this.stockCodeNormalizersByMarket[marketCode]) {
            return this.stockCodeNormalizersByMarket[marketCode](assetCode);
        }

        return null;
    }

    /**
     * 종목 코드를 기준으로 마켓 코드를 추출합니다.
     * @param stockCode
     * @private
     */
    private toMarketCode(stockCode: string) {
        if (this.isKoreaStockCode(stockCode)) {
            return 'KOREA';
        }

        if (this.isUsaStockCode(stockCode)) {
            return 'US';
        }
    }

    /**
     * 미국 종목 코드인지 확인합니다.
     * @param stockCode
     * @private
     */
    private isUsaStockCode(stockCode: string) {
        return stockCode.startsWith('US.');
    }

    /**
     * 한국 종목 코드인지 확인합니다.
     * @param stockCode
     * @private
     */
    private isKoreaStockCode(stockCode: string) {
        return this.koreaStockPatternRegExp.test(stockCode);
    }

    /**
     * 미국 종목 코드를 정규화합니다.
     * @param stockCode
     * @private
     */
    private toNormalizeStockCodeByUsaStockCode(stockCode: string) {
        return stockCode.replace('US.', '');
    }

    /**
     * 한국 종목 코드를 정규화합니다.
     * @param stockCode
     * @private
     */
    private toNormalizeStockCodeByKoreaStockCode(stockCode: string) {
        return stockCode.slice(-6);
    }
}
