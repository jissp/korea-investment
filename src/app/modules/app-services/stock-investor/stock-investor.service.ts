import { Injectable, Logger } from '@nestjs/common';
import { toDateYmdByDate } from '@common/utils';
import { MarketDivCode } from '@modules/korea-investment/common';
import { KoreaInvestmentQuotationClient } from '@modules/korea-investment/korea-investment-quotation-client';
import { YN } from '@app/common/types';
import {
    StockInvestor,
    StockInvestorService as StockInvestorRepositoryService,
} from '@app/modules/repositories/stock-investor';
import { StockService } from '@app/modules/repositories/stock';
import { StockInvestorTransformer } from '@app/modules/crawlers/stock-crawler/transformers';

@Injectable()
export class StockInvestorService {
    private readonly logger = new Logger(StockInvestorService.name);

    constructor(
        private readonly koreaInvestmentQuotationClient: KoreaInvestmentQuotationClient,
        private readonly stockService: StockService,
        private readonly stockInvestorService: StockInvestorRepositoryService,
    ) {}

    /**
     * 종목의 투자자 동향 정보를 조회합니다.
     * @param stockCode
     * @param limit
     */
    public async getDailyInvestors(
        stockCode: string,
        limit: number = 30,
    ): Promise<StockInvestor[]> {
        try {
            const stockInvestors =
                await this.stockInvestorService.getListByStockCode({
                    stockCode,
                    limit,
                });

            // TODO jissp
            const hasToday =
                stockInvestors[0]?.date ===
                toDateYmdByDate({
                    separator: '-',
                });
            const isExistsZeroCount = stockInvestors.some((stockInvestor) => {
                const sumInvestorCount = stockInvestors
                    ? stockInvestor.person +
                      stockInvestor.foreigner +
                      stockInvestor.organization +
                      stockInvestor.financialInvestment +
                      stockInvestor.investmentTrust +
                      stockInvestor.privateEquity +
                      stockInvestor.bank +
                      stockInvestor.insurance +
                      stockInvestor.merchantBank +
                      stockInvestor.fund +
                      stockInvestor.etc
                    : 0;

                return sumInvestorCount === 0;
            });

            if (hasToday && !isExistsZeroCount) {
                return stockInvestors;
            }

            await this.fetchAndSaveStockInvestors(stockCode);

            return await this.stockInvestorService.getListByStockCode({
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
    private async fetchAndSaveStockInvestors(stockCode: string) {
        const stock = await this.stockService.getStock(stockCode);
        if (!stock) {
            return [];
        }

        const divCode =
            stock.isNextTrade === YN.Y ? MarketDivCode.통합 : MarketDivCode.KRX;
        const response =
            await this.koreaInvestmentQuotationClient.getInvestorTradeByStockDaily(
                {
                    FID_INPUT_ISCD: stockCode,
                    FID_COND_MRKT_DIV_CODE: divCode,
                    FID_INPUT_DATE_1: toDateYmdByDate({
                        separator: '-',
                    }),
                },
            );

        const transformer = new StockInvestorTransformer();
        const transformedStockInvestors = response.output2.map((output) =>
            transformer.transform({
                stockCode,
                output,
            }),
        );

        await this.stockInvestorService.upsert(transformedStockInvestors);
    }
}
