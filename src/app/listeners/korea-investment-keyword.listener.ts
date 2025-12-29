import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { isDelistedStockByName } from '@app/common';
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

    @OnEvent(KoreaInvestmentKeywordSettingEvent.UpdatedKeyword)
    public async handleUpdatedKeyword() {
        try {
            const keywordsChunk = await Promise.all(
                [
                    KeywordType.Manual,
                    KeywordType.Possess,
                    KeywordType.StockGroup,
                ].map((keywordType) =>
                    this.keywordSettingService.getKeywordsByType(keywordType),
                ),
            );

            const uniqueKeywords = Array.from(
                new Set(keywordsChunk.flat()),
            ).filter((keyword) => !isDelistedStockByName(keyword));

            await this.keywordSettingService.setKeywords(uniqueKeywords);
        } catch (error) {
            this.logger.error(error);
        }
    }

    @OnEvent(KoreaInvestmentKeywordSettingEvent.DeletedKeyword)
    public async handleDeletedKeyword({ keyword }: { keyword: string }) {
        try {
            const stockCodes =
                await this.keywordSettingService.getStockCodesFromKeyword(
                    keyword,
                );

            // 키워드 정보 제거
            await Promise.all([
                ...stockCodes.map((stockCode) =>
                    this.keywordSettingService.deleteKeywordFromStock(
                        stockCode,
                        keyword,
                    ),
                ),
                this.newsService.deleteKeywordNews(keyword),
            ]);
        } catch (error) {
            this.logger.error(error);
        }
    }

    @OnEvent(KoreaInvestmentKeywordSettingEvent.DeletedStockCode)
    public async handleDeletedStockCode({ stockCode }: { stockCode: string }) {
        const keywords =
            await this.keywordSettingService.getKeywordsByStockCode(stockCode);

        // 키워드 정보 제거
        await Promise.all([
            ...keywords.map((keyword) =>
                this.keywordSettingService.deleteStockCodeFromKeyword(
                    keyword,
                    stockCode,
                ),
            ),
            this.newsService.deleteNaverNewsByStockCode(stockCode),
        ]);
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
            this.keywordSettingService.addKeywordsByType(
                KeywordType.Manual,
                keyword,
            ),
            this.keywordSettingService.addStockCodeToKeyword(
                stockCode,
                keyword,
            ),
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
        await this.keywordSettingService.deleteStockCodeFromKeyword(
            keyword,
            stockCode,
        );

        const count =
            await this.keywordSettingService.getStockCodeCountFromKeyword(
                keyword,
            );
        if (count === 0) {
            // 키워드와 뉴스 제거
            await Promise.all([
                this.keywordSettingService.deleteKeywordsByType(
                    KeywordType.Manual,
                    keyword,
                ),
                this.newsService.deleteKeywordNews(keyword),
            ]);
        }
    }
}
