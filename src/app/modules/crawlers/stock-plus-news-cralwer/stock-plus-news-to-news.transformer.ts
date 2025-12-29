import { NewsCategory, NewsItem } from '@app/modules/news';
import { StockPlusAsset, StockPlusNews } from '@modules/stock-plus';

export class StockPlusNewsToNewsTransformer {
    private readonly koreaStockPatternRegExp = /^A[0-9]{6}$/;

    private readonly stockCodeNormalizersByMarket: Record<
        string,
        (stockCode: string) => string
    > = {
        US: this.toNormalizeStockCodeByUsaStockCode,
        KOREA: this.toNormalizeStockCodeByKoreaStockCode,
    };

    public transform(stockPlusNews: StockPlusNews): NewsItem {
        return {
            articleId: stockPlusNews.id.toString(),
            category: NewsCategory.StockPlus,
            title: stockPlusNews.title,
            description: stockPlusNews.summaries[0],
            stockCodes: stockPlusNews.assets
                .map(this.mapAssetCodeToStockCode, this)
                .filter(Boolean) as string[],
            createdAt: new Date(stockPlusNews.publishedAt).toISOString(),
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
