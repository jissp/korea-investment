import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
    KeywordType,
    KoreaInvestmentKeywordSettingEvent,
    KoreaInvestmentKeywordSettingService,
} from '@app/modules/korea-investment-setting';
import { NewsService } from '@app/modules/news';

@Injectable()
export class KoreaInvestmentKeywordListener {
    private readonly logger = new Logger(KoreaInvestmentKeywordListener.name);

    constructor(
        private readonly keywordSettingService: KoreaInvestmentKeywordSettingService,
        private readonly newsService: NewsService,
    ) {}

    @OnEvent(KoreaInvestmentKeywordSettingEvent.DeletedKeyword)
    public async handleDeletedKeyword({ keyword }: { keyword: string }) {
        try {
            const stockCodes =
                await this.keywordSettingService.getStockCodesByKeyword(
                    keyword,
                );

            // 키워드 정보 제거
            await Promise.all([
                ...stockCodes.map((stockCode) =>
                    this.keywordSettingService.deleteKeywordFromStock({
                        stockCode: stockCode,
                        keyword: keyword,
                    }),
                ),
                this.newsService.deleteKeywordNews(keyword),
            ]);
        } catch (error) {
            this.logger.error(error);
        }
    }

    @OnEvent(KoreaInvestmentKeywordSettingEvent.AddedStockKeyword)
    public async handleAddedStockKeyword({
        stockCode,
        keyword,
    }: {
        stockCode: string;
        keyword: string;
    }) {
        await Promise.all([
            this.keywordSettingService.addKeywordByType(
                KeywordType.Manual,
                keyword,
            ),
            this.keywordSettingService.addStockCodeToKeyword({
                keyword: stockCode,
                stockCode: keyword,
            }),
        ]);
    }

    @OnEvent(KoreaInvestmentKeywordSettingEvent.DeletedStockKeyword)
    public async handleRemovedStockKeyword({
        stockCode,
        keyword,
    }: {
        stockCode: string;
        keyword: string;
    }) {
        await this.keywordSettingService.deleteStockCodeFromKeyword({
            keyword: keyword,
            stockCode: stockCode,
        });

        const count =
            await this.keywordSettingService.getStockCodeCountFromKeyword(
                keyword,
            );
        if (count === 0) {
            // 키워드와 뉴스 제거
            await Promise.all([
                this.keywordSettingService.deleteKeywordByType(
                    KeywordType.Manual,
                    keyword,
                ),
                this.newsService.deleteKeywordNews(keyword),
            ]);
        }
    }
}
