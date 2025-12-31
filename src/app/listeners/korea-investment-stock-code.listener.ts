import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { getStockName } from '@common/domains';
import { isDelistedStockByName, toKeywordType } from '@app/common';
import {
    KoreaInvestmentKeywordSettingService,
    KoreaInvestmentSettingEvent,
    KoreaInvestmentSettingService,
    StockCodeType,
} from '@app/modules/korea-investment-setting';
import { NewsService } from '@app/modules/news';

@Injectable()
export class KoreaInvestmentStockCodeListener {
    private readonly logger = new Logger(KoreaInvestmentStockCodeListener.name);

    constructor(
        private readonly settingService: KoreaInvestmentSettingService,
        private readonly keywordSettingService: KoreaInvestmentKeywordSettingService,
        private readonly newsService: NewsService,
    ) {}

    @OnEvent(KoreaInvestmentSettingEvent.AllStockCodeEvent)
    public async handleAllStockCode() {
        try {
            const stockCodesChunk = await Promise.all(
                [
                    StockCodeType.Manual,
                    StockCodeType.Possess,
                    StockCodeType.StockGroup,
                    StockCodeType.Favorite,
                ].map((stockCodeType) =>
                    this.settingService.getStockCodesByType(stockCodeType),
                ),
            );

            const uniqueStockCodes = Array.from(
                new Set(stockCodesChunk.flat()),
            ).filter((keyword) => !isDelistedStockByName(keyword));

            await this.settingService.setStockCodes(uniqueStockCodes);
        } catch (error) {
            this.logger.error(error);
        }
    }

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
                this.newsService.deleteNaverNewsByStockCode(stockCode),
                this.keywordSettingService.clearKeywordByStock(stockCode),
            ]);
        } catch (error) {
            this.logger.error(error);
        }
    }
}
