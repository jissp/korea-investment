import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RedisSet } from '@modules/redis';
import {
    KoreaInvestmentSettingHelperService,
    KoreaInvestmentSettingKey,
} from '@app/modules/korea-investment-setting';
import { StockService } from '@app/modules/stock';
import { StockKeywordEventType } from './stock-keyword.types';

@Injectable()
export class StockKeywordService {
    private readonly logger = new Logger(StockKeywordService.name);
    private readonly stockKeywordsSet: RedisSet;

    constructor(
        private readonly stockService: StockService,
        private readonly koreaInvestmentSettingHelperService: KoreaInvestmentSettingHelperService,
        @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2,
    ) {
        this.stockKeywordsSet =
            this.koreaInvestmentSettingHelperService.getSettingSet(
                KoreaInvestmentSettingKey.Keywords,
            );
    }

    /**
     * 키워드를 등록합니다.
     * @param keyword
     */
    public async addKeyword(keyword: string) {
        return this.stockKeywordsSet.add(keyword);
    }

    /**
     * 키워드를 삭제합니다.
     * @param keyword
     */
    public async removeKeyword(keyword: string) {
        return this.stockKeywordsSet.remove(keyword);
    }

    /**
     * 종목별 키워드 목록을 가져옵니다.
     * @param stockCode
     */
    public async getStockKeywords(stockCode: string) {
        try {
            await this.assertStockCodeExists(stockCode);

            return this.getKeywordSet(stockCode).list();
        } catch (error) {
            if (error instanceof NotFoundException) {
                return [];
            }

            this.logger.error(error);
            throw error;
        }
    }

    /**
     * 종목별 키워드 추가합니다.
     * @param stockCode
     * @param keyword
     */
    public async addStockKeyword(stockCode: string, keyword: string) {
        await this.assertStockCodeExists(stockCode);

        const isAdded = await this.getKeywordSet(stockCode).add(keyword);
        if (isAdded) {
            this.eventEmitter.emit(StockKeywordEventType.AddedStockKeyword, {
                stockCode,
                keyword,
            });
        }

        return isAdded;
    }

    /**
     * 종목별 키워드 삭제합니다.
     * @param stockCode
     * @param keyword
     */
    public async deleteStockKeyword(stockCode: string, keyword: string) {
        await this.assertStockCodeExists(stockCode);

        const isDeleted = await this.getKeywordSet(stockCode).remove(keyword);
        if (isDeleted) {
            this.eventEmitter.emit(StockKeywordEventType.RemovedStockKeyword, {
                stockCode,
                keyword,
            });
        }

        return isDeleted;
    }

    /**
     * 종목별 키워드 Set을 생성합니다.
     * @param stockCode
     * @private
     */
    private getKeywordSet(stockCode: string) {
        return this.koreaInvestmentSettingHelperService.getSettingSet(
            KoreaInvestmentSettingKey.Keywords,
            stockCode,
        );
    }

    /**
     * 종목 코드가 존재하는지 검증합니다.
     * @param stockCode
     * @throws NotFoundException
     * @private
     */
    private async assertStockCodeExists(stockCode: string) {
        const isExistsStockCode =
            await this.stockService.existsStockCodes(stockCode);
        if (!isExistsStockCode) {
            throw new NotFoundException(`Stock code ${stockCode} not found`);
        }
    }
}
