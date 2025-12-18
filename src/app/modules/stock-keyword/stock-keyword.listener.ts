import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
    KoreaInvestmentSettingHelperService,
    KoreaInvestmentSettingKey,
} from '@app/modules/korea-investment-setting';
import { StockKeywordEventType } from './stock-keyword.types';
import { StockKeywordService } from './stock-keyword.service';

@Injectable()
export class StockKeywordListener {
    constructor(
        private readonly koreaInvestmentSettingHelperService: KoreaInvestmentSettingHelperService,
        private readonly stockKeywordService: StockKeywordService,
    ) {}

    @OnEvent(StockKeywordEventType.AddedStockKeyword)
    public async handleAddedStockKeyword({
        stockCode,
        keyword,
    }: {
        stockCode: string;
        keyword: string;
    }) {
        const set = this.koreaInvestmentSettingHelperService.getSettingSet(
            KoreaInvestmentSettingKey.StockKeywordMap,
            keyword,
        );

        await Promise.all([
            set.add(stockCode),
            this.stockKeywordService.addKeyword(keyword),
        ]);
    }

    @OnEvent(StockKeywordEventType.RemovedStockKeyword)
    public async handleRemovedStockKeyword({
        stockCode,
        keyword,
    }: {
        stockCode: string;
        keyword: string;
    }) {
        const set = this.koreaInvestmentSettingHelperService.getSettingSet(
            KoreaInvestmentSettingKey.StockKeywordMap,
            keyword,
        );

        await set.remove(stockCode);

        const count = await set.count();
        if (count === 0) {
            // 키워드와 뉴스 제거
            await Promise.all([
                this.stockKeywordService.removeKeyword(keyword),
            ]);
        }
    }
}
