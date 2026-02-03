import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Nullable } from '@common/types';
import {
    toDateByKoreaInvestmentTime,
    toDateByKoreaInvestmentYmd,
} from '@common/utils';
import { DomesticStockQuotationsNewsTitleOutput } from '@modules/korea-investment/korea-investment-quotation-client';
import { NewsCategory, NewsDto } from '@app/modules/repositories/news';
import {
    NewsStrategy,
    RequestCrawlingNewsJobPayload,
} from '../news-crawler.types';
import { BaseStrategy } from './base-strategy';
import { KoreaInvestmentRequestApiHelper } from '@app/modules/korea-investment-request-api/common';

@Injectable()
export class KoreaInvestmentStrategy extends BaseStrategy<
    NewsStrategy.KoreaInvestment,
    DomesticStockQuotationsNewsTitleOutput
> {
    private readonly logger = new Logger(KoreaInvestmentStrategy.name);

    private readonly stockCodeFields: (keyof DomesticStockQuotationsNewsTitleOutput)[] =
        ['iscd1', 'iscd2', 'iscd3', 'iscd4', 'iscd5'];

    constructor(private readonly helper: KoreaInvestmentRequestApiHelper) {
        super();
    }

    protected async fetch(
        job: Job<RequestCrawlingNewsJobPayload<NewsStrategy.KoreaInvestment>>,
    ): Promise<DomesticStockQuotationsNewsTitleOutput[]> {
        try {
            const childrenResponses = await this.helper.getChildResponses<
                unknown,
                DomesticStockQuotationsNewsTitleOutput
            >(job);

            return childrenResponses.flatMap(({ response }) => response.output);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    protected transform(
        value: DomesticStockQuotationsNewsTitleOutput,
    ): NewsDto {
        const createdAt = this.toNormalizeCreatedAt(value);
        const createdAtDate = createdAt ? new Date(createdAt) : new Date();

        return {
            articleId: value.cntt_usiq_srno,
            category: NewsCategory.KoreaInvestment,
            title: value.hts_pbnt_titl_cntt,
            publishedAt: createdAtDate,
        };
    }

    /**
     * 종목 코드를 추출합니다.
     * @param koreaInvestmentNews
     * @private
     */
    public extractStockCodes(
        koreaInvestmentNews: DomesticStockQuotationsNewsTitleOutput,
    ) {
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
        koreaInvestmentNews: DomesticStockQuotationsNewsTitleOutput,
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
