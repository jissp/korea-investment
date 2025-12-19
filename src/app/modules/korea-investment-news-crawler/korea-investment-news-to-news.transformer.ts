import { Nullable } from '@common/types';
import { NewsCategory, NewsItem } from '@app/modules/news';
import { KoreaInvestmentNewsItem } from './korea-investment-news-crawler.types';

export class KoreaInvestmentNewsToNewsTransformer {
    private readonly stockCodeFields: (keyof KoreaInvestmentNewsItem)[] = [
        'iscd1',
        'iscd2',
        'iscd3',
        'iscd4',
        'iscd5',
    ];

    public transform(koreaInvestmentNews: KoreaInvestmentNewsItem): NewsItem {
        const createdAt = this.toNormalizeCreatedAt(koreaInvestmentNews);
        const createdAtDate = createdAt ? new Date(createdAt) : new Date();

        return {
            articleId: koreaInvestmentNews.cntt_usiq_srno,
            category: NewsCategory.KoreaInvestment,
            title: koreaInvestmentNews.hts_pbnt_titl_cntt,
            stockCodes: this.extractStockCodes(koreaInvestmentNews),
            createdAt: createdAtDate.toISOString(),
        };
    }

    /**
     * 종목 코드를 추출합니다.
     * @param koreaInvestmentNews
     * @private
     */
    private extractStockCodes(koreaInvestmentNews: KoreaInvestmentNewsItem) {
        const stockCodes: string[] = [];

        this.stockCodeFields.forEach((field) => {
            if (koreaInvestmentNews[field]) {
                stockCodes.push(koreaInvestmentNews[field]);
            }
        });

        return stockCodes;
    }

    /**
     * 한국투자증권 뉴스의 생성 일시를 정규화합니다.
     * @param koreaInvestmentNews
     * @private
     */
    private toNormalizeCreatedAt(
        koreaInvestmentNews: KoreaInvestmentNewsItem,
    ): Nullable<string> {
        const { data_dt, data_tm } = koreaInvestmentNews;

        const dateMatch = data_dt.match(/(\d{4})(\d{2})(\d{2})/);
        const timeMatch = data_tm.match(/(\d{2})(\d{2})(\d{2})/);

        if (!dateMatch || !timeMatch) {
            return null;
        }

        const [, year, month, day] = dateMatch;
        const [, hour, minute, second] = timeMatch;

        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
}
