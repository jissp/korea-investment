import { StockPlusAsset, StockPlusNews } from '@modules/stock-plus';
import { NewsCategory, NewsDto } from '@app/modules/repositories/news';

export interface StockPlusNewsTransformResult {
    stockCodes: string[];
    news: NewsDto;
}

export class StockPlusNewsTransformer {
    private readonly koreaStockPatternRegExp = /^A[0-9]{6}$/;

    private readonly stockCodeNormalizersByMarket: Record<
        string,
        (stockCode: string) => string
    > = {
        US: this.toNormalizeStockCodeByUsaStockCode.bind(this),
        KOREA: this.toNormalizeStockCodeByKoreaStockCode.bind(this),
    };

    public transform(
        stockPlusNews: StockPlusNews,
    ): StockPlusNewsTransformResult {
        return {
            stockCodes: stockPlusNews.assets
                .map((asset) => this.mapAssetCodeToStockCode(asset))
                .filter(Boolean) as string[],
            news: {
                articleId: stockPlusNews.id.toString(),
                category: NewsCategory.StockPlus,
                title: stockPlusNews.title,
                description: stockPlusNews.summaries[0],
                publishedAt: new Date(stockPlusNews.publishedAt),
            },
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
