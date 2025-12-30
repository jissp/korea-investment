import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnQueueProcessor } from '@modules/queue';
import { NaverApiClient } from '@modules/naver';
import { StockPlusClient } from '@modules/stock-plus';
import {
    KoreaInvestmentKeywordSettingService,
    KoreaInvestmentSettingService,
} from '@app/modules/korea-investment-setting';
import { KoreaInvestmentRequestApiHelper } from '@app/modules/korea-investment-request-api';
import { NewsService } from '@app/modules/news';
import {
    NewsCrawlerQueueType,
    RequestDomesticNewsTitleJobPayload,
} from './news-crawler.types';
import { RequestDomesticNewsTitleResponse } from './news-crawler.interface';
import { NaverNewsToNewsTransformer } from './transformers/naver-news-to-news.transformer';
import {
    KoreaInvestmentNewsToNewsTransformer,
    StockPlusNewsToNewsTransformer,
} from '@app/modules/crawlers/news-crawler/transformers';

@Injectable()
export class NewsCrawlerProcessor {
    private readonly logger = new Logger(NewsCrawlerProcessor.name);

    constructor(
        private readonly settingService: KoreaInvestmentSettingService,
        private readonly keywordSettingService: KoreaInvestmentKeywordSettingService,
        private readonly koreaInvestmentRequestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly naverClient: NaverApiClient,
        private readonly stockPlusClient: StockPlusClient,
        private readonly newsService: NewsService,
    ) {}

    @OnQueueProcessor(NewsCrawlerQueueType.CrawlingNaverNews)
    public async processCrawlingNaverNews(
        job: Job<RequestDomesticNewsTitleJobPayload>,
    ) {
        const { keyword } = job.data;

        const stockCodes =
            await this.keywordSettingService.getStockCodesFromKeyword(keyword);

        const response = await this.naverClient.getNews({
            query: keyword,
            start: 1,
            display: 30,
            sort: 'date',
        });

        const transformer = new NaverNewsToNewsTransformer();
        const transformedNewsItems = response.items.map((item) => ({
            ...transformer.transform(item),
            stockCodes,
        }));

        for (const newsItem of transformedNewsItems) {
            try {
                await Promise.all([
                    this.newsService.addNews(newsItem),
                    this.newsService.addKeywordNews(keyword, newsItem),
                    ...stockCodes.map((stockCode) =>
                        this.newsService.addStockNews(stockCode, newsItem),
                    ),
                ]);
            } catch (error) {
                this.logger.error(error);
            }
        }
    }

    @OnQueueProcessor(NewsCrawlerQueueType.CrawlingStockPlusNews)
    public async processCrawlingStockPlusNews() {
        try {
            const response = await this.stockPlusClient.getLatestNews();

            const transformer = new StockPlusNewsToNewsTransformer();
            const transformedNewsItems = response.data.breakingNews.map(
                (stockPlusNews) => transformer.transform(stockPlusNews),
            );

            await Promise.all(
                transformedNewsItems.map((newsItem) =>
                    this.newsService.addNews(newsItem),
                ),
            );
        } catch (error) {
            this.logger.error(error);
        }
    }

    @OnQueueProcessor(NewsCrawlerQueueType.RequestDomesticNewsTitle)
    async processRequestDomesticNewsTitle(job: Job) {
        const childrenResponse =
            await this.koreaInvestmentRequestApiHelper.getChildResponses<
                any,
                RequestDomesticNewsTitleResponse
            >(job);
        const newsItems = childrenResponse.flatMap(
            ({ response }) => response.output,
        );

        const settingStockCodes = await this.settingService.getStockCodes();
        const stockCodeSet = new Set(settingStockCodes);

        const transformer = new KoreaInvestmentNewsToNewsTransformer();
        const transformedNewsItems = newsItems.map((newsItem) =>
            transformer.transform(newsItem),
        );

        for (const newsItem of transformedNewsItems) {
            try {
                // 설정된 종목 코드에 해당하는 종목만 종목 뉴스에 추가합니다.
                const filteredStockCodes = newsItem.stockCodes.filter(
                    (stockCode) => stockCodeSet.has(stockCode),
                );

                await Promise.all([
                    this.newsService.addNews(newsItem),
                    ...filteredStockCodes.map((stockCode) =>
                        this.newsService.addStockNews(stockCode, newsItem),
                    ),
                ]);
            } catch (error) {
                this.logger.error(error);
            }
        }
    }
}
