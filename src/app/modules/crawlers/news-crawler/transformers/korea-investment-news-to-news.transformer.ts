import { Logger } from '@nestjs/common';
import { Nullable } from '@common/types';
import {
    toDateByKoreaInvestmentTime,
    toDateByKoreaInvestmentYmd,
} from '@common/utils';
import { NewsCategory, NewsDto } from '@app/modules/repositories/news';
import { KoreaInvestmentNewsItem } from '../news-crawler.interface';

export class KoreaInvestmentNewsToNewsTransformer {
    private readonly logger = new Logger(
        KoreaInvestmentNewsToNewsTransformer.name,
    );

    private readonly stockCodeFields: (keyof KoreaInvestmentNewsItem)[] = [
        'iscd1',
        'iscd2',
        'iscd3',
        'iscd4',
        'iscd5',
    ];

    public transform(koreaInvestmentNews: KoreaInvestmentNewsItem): {
        stockCodes: string[];
        news: NewsDto;
    } {
        const createdAt = this.toNormalizeCreatedAt(koreaInvestmentNews);
        const createdAtDate = createdAt ? new Date(createdAt) : new Date();

        return {
            stockCodes: this.extractStockCodes(koreaInvestmentNews),
            news: {
                articleId: koreaInvestmentNews.cntt_usiq_srno,
                category: NewsCategory.KoreaInvestment,
                title: koreaInvestmentNews.hts_pbnt_titl_cntt,
                publishedAt: createdAtDate,
            },
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

        try {
            const date = toDateByKoreaInvestmentYmd(data_dt);
            const time = toDateByKoreaInvestmentTime(data_tm);

            return `${date} ${time}`;
        } catch (error) {
            this.logger.error('Failed to normalize created at', error);
            return null;
        }
    }
}
