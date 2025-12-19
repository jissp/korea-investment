import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NewsService } from '@app/modules/news';
import { KoreaInvestmentSettingEvent } from './korea-investment-setting.types';
import { KoreaInvestmentSettingService } from './korea-investment-setting.service';

@Injectable()
export class KoreaInvestmentSettingListener {
    private readonly logger = new Logger(KoreaInvestmentSettingListener.name);

    constructor(
        private readonly koreaInvestmentSettingService: KoreaInvestmentSettingService,
        private readonly newsService: NewsService,
    ) {}

    @OnEvent(KoreaInvestmentSettingEvent.DeletedKeyword)
    public async handleDeletedKeyword({ keyword }: { keyword: string }) {
        try {
            const stockCodes =
                await this.koreaInvestmentSettingService.getStockCodesFromKeyword(
                    keyword,
                );

            // 키워드 정보 제거
            await Promise.all([
                ...stockCodes.map((stockCode) =>
                    this.koreaInvestmentSettingService.deleteKeywordFromStock(
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

    @OnEvent(KoreaInvestmentSettingEvent.DeletedStockCode)
    public async handleDeletedStockCode({ stockCode }: { stockCode: string }) {
        const keywords =
            await this.koreaInvestmentSettingService.getKeywordsByStockCode(
                stockCode,
            );

        // 키워드 정보 제거
        await Promise.all([
            ...keywords.map((keyword) =>
                this.koreaInvestmentSettingService.deleteStockCodeFromKeyword(
                    keyword,
                    stockCode,
                ),
            ),
            this.newsService.deleteNaverNewsByStockCode(stockCode),
        ]);
    }

    @OnEvent(KoreaInvestmentSettingEvent.AddedStockKeyword)
    public async handleAddedStockKeyword({
        stockCode,
        keyword,
    }: {
        stockCode: string;
        keyword: string;
    }) {
        await Promise.all([
            this.koreaInvestmentSettingService.addKeyword(keyword),
            this.koreaInvestmentSettingService.addStockCodeToKeyword(
                stockCode,
                keyword,
            ),
        ]);
    }

    @OnEvent(KoreaInvestmentSettingEvent.DeletedStockKeyword)
    public async handleRemovedStockKeyword({
        stockCode,
        keyword,
    }: {
        stockCode: string;
        keyword: string;
    }) {
        await this.koreaInvestmentSettingService.deleteStockCodeFromKeyword(
            keyword,
            stockCode,
        );

        const count =
            await this.koreaInvestmentSettingService.getStockCodeCountFromKeyword(
                keyword,
            );
        if (count === 0) {
            // 키워드와 뉴스 제거
            await Promise.all([
                this.koreaInvestmentSettingService.deleteKeyword(keyword),
                this.newsService.deleteKeywordNews(keyword),
            ]);
        }
    }
}
