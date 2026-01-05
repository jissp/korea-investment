import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { getStockName } from '@common/domains';
import { toKeywordType } from '@app/common';
import {
    KoreaInvestmentKeywordSettingService,
    KoreaInvestmentSettingEvent,
    StockCodeType,
} from '@app/modules/korea-investment-setting';
import { NewsRepository } from '@app/modules/repositories/news-repository';

@Injectable()
export class KoreaInvestmentStockCodeListener {
    private readonly logger = new Logger(KoreaInvestmentStockCodeListener.name);

    constructor(
        private readonly keywordSettingService: KoreaInvestmentKeywordSettingService,
        private readonly newsRepository: NewsRepository,
    ) {}

    @OnEvent(KoreaInvestmentSettingEvent.UpdatedStockCode)
    public async handleUpdatedStockCode({
        stockCodeType,
        stockCode,
    }: {
        stockCode: string;
        stockCodeType: StockCodeType;
    }) {
        try {
            const stockName = getStockName(stockCode);

            await Promise.all([
                this.keywordSettingService.addKeywordByType(
                    toKeywordType(stockCodeType),
                    stockName,
                ),
                this.keywordSettingService.addStockCodeToKeyword({
                    keyword: stockName,
                    stockCode: stockCode,
                }),
                this.keywordSettingService.addKeywordToStock({
                    stockCode: stockCode,
                    keyword: stockName,
                }),
            ]);
        } catch (error) {
            this.logger.error(error);
        }
    }

    @OnEvent(KoreaInvestmentSettingEvent.DeletedStockCode)
    public async handleDeletedStockCode({ stockCode }: { stockCode: string }) {
        try {
            await Promise.all([
                this.newsRepository.deleteNaverNewsByStockCode(stockCode),
                this.keywordSettingService.clearKeywordByStock(stockCode),
            ]);
        } catch (error) {
            this.logger.error(error);
        }
    }
}
