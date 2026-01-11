import { Injectable, Logger } from '@nestjs/common';
import { MarketDivCode } from '@modules/korea-investment/common';
import { KoreaInvestmentQuotationClient } from '@modules/korea-investment/korea-investment-quotation-client';
import { DomesticStockInvestorTransformer } from '@app/modules/crawlers/stock-crawler';
import {
    StockDailyInvestor,
    StockDailyInvestorService,
} from '@app/modules/repositories/stock-daily-investor';

@Injectable()
export class StockInvestorService {
    private readonly logger = new Logger(StockInvestorService.name);

    constructor(
        private readonly koreaInvestmentQuotationClient: KoreaInvestmentQuotationClient,
        private readonly stockDailyInvestorService: StockDailyInvestorService,
    ) {}

    /**
     * 종목의 투자자 동향 정보를 조회합니다.
     * @param stockCode
     * @param limit
     */
    public async getDailyInvestors(
        stockCode: string,
        limit: number = 30,
    ): Promise<StockDailyInvestor[]> {
        try {
            const stockInvestors =
                await this.stockDailyInvestorService.getStockDailyInvestors({
                    stockCode,
                    limit,
                });

            const hasToday = stockInvestors[0]?.date === this.getTodayDate();
            if (hasToday) {
                return stockInvestors;
            }

            await this.fetchAndSaveStockDailyInvestors(stockCode);

            return await this.stockDailyInvestorService.getStockDailyInvestors({
                stockCode,
                limit,
            });
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     * 한국투자증권 API를 통해 투자자 정보를 조회하고 저장합니다.
     * @param stockCode
     * @private
     */
    private async fetchAndSaveStockDailyInvestors(stockCode: string) {
        const response =
            await this.koreaInvestmentQuotationClient.inquireInvestor({
                FID_INPUT_ISCD: stockCode,
                FID_COND_MRKT_DIV_CODE: MarketDivCode.KRX, // Fixed to KRX
            });

        const transformer = new DomesticStockInvestorTransformer();
        const transformedStockInvestors = response.map((output) =>
            transformer.transform({
                stockCode,
                output,
            }),
        );

        await this.stockDailyInvestorService.upsert(transformedStockInvestors);
    }

    /**
     * 현재 날짜를 년-월-일 형식으로 반환한다.
     */
    private getTodayDate(date: Date = new Date()): string {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
}
