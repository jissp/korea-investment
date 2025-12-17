import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnQueueProcessor } from '@modules/queue';
import { NaverApiClient } from '@modules/naver';
import {
    KoreaInvestmentSettingHelperService,
    KoreaInvestmentSettingKey,
} from '@app/modules/korea-investment-setting';
import { NaverNewsService } from '@app/modules/naver-news';
import { NaverNewsCrawlerQueueType } from './naver-news-crawler.types';

@Injectable()
export class NaverNewsCrawlerProcessor {
    private readonly logger = new Logger(NaverNewsCrawlerProcessor.name);

    constructor(
        private readonly client: NaverApiClient,
        private readonly koreaInvestmentSettingHelperService: KoreaInvestmentSettingHelperService,
        private readonly naverNewsService: NaverNewsService,
    ) {}

    @OnQueueProcessor(NaverNewsCrawlerQueueType.CrawlingNaverNews)
    public async processCrawlingNaverNews(job: Job) {
        const { keyword } = job.data;

        const stockCodes = await this.koreaInvestmentSettingHelperService
            .getSettingSet(KoreaInvestmentSettingKey.StockKeywordMap, keyword)
            .list();
        if (!stockCodes.length) {
            return;
        }

        const response = await this.client.getNews({
            query: keyword,
            start: 1,
            display: 100,
            sort: 'date',
        });

        for (const item of response.items) {
            try {
                const newsId = item.link;
                const score = new Date(item.pubDate).getTime();

                // 뉴스 저장
                await this.naverNewsService.setNews(newsId, item);
                await this.naverNewsService.setNewsScore(newsId, score);

                // 키워드별 뉴스 저장
                await this.naverNewsService.setKeywordNewsScore(
                    keyword,
                    newsId,
                    score,
                );

                // 종목별 뉴스 저장
                for (const stockCode of stockCodes) {
                    await this.naverNewsService.setStockNewsScore(
                        stockCode,
                        newsId,
                        score,
                    );
                }
            } catch (error) {
                this.logger.error(error);
            }
        }
    }
}
