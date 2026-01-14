import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { toDateYmdByDate } from '@common/utils';
import { MarketDivCode } from '@modules/korea-investment/common';
import { KoreaInvestmentQuotationClient } from '@modules/korea-investment/korea-investment-quotation-client';
import { StockInvestorByEstimateTransformer, YN } from '@app/common';
import {
    StockDailyInvestor,
    StockDailyInvestorService,
} from '@app/modules/repositories/stock-daily-investor';
import { StockService } from '@app/modules/repositories/stock';
import { DomesticStockInvestorTransformer } from '@app/modules/crawlers/stock-crawler';
import { StockInvestorByEstimateDto } from '@app/controllers/stocks/dto/responses/get-stock-investor-by-estimate.response';

@Injectable()
export class StockInvestorService {
    private readonly logger = new Logger(StockInvestorService.name);

    constructor(
        private readonly koreaInvestmentQuotationClient: KoreaInvestmentQuotationClient,
        private readonly stockService: StockService,
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

            const hasToday =
                stockInvestors[0]?.date ===
                toDateYmdByDate({
                    separator: '-',
                });
            const isExistsZeroCount = stockInvestors.some((stockInvestor) => {
                const sumInvestorCount = stockInvestors
                    ? stockInvestor.person +
                      stockInvestor.foreigner +
                      stockInvestor.organization
                    : 0;

                return sumInvestorCount === 0;
            });

            if (hasToday && !isExistsZeroCount) {
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
     * 종목의 투자자 동향 정보를 조회합니다.
     * @param stockCode
     */
    public async getDailyInvestorByEstimate(
        stockCode: string,
    ): Promise<StockInvestorByEstimateDto[]> {
        try {
            const stock = await this.stockService.getStock(stockCode);
            if (!stock) {
                throw new NotFoundException(
                    `Stock with code ${stockCode} not found`,
                );
            }

            const transformer = new StockInvestorByEstimateTransformer();
            const outputs =
                await this.koreaInvestmentQuotationClient.inquireInvestorByEstimate(
                    {
                        MKSC_SHRN_ISCD: stock.shortCode,
                    },
                );

            return outputs.map((output) =>
                transformer.transform({
                    stock,
                    output,
                }),
            );
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
        const stock = await this.stockService.getStock(stockCode);
        if (!stock) {
            return [];
        }

        const divCode =
            stock.isNextTrade === YN.Y ? MarketDivCode.통합 : MarketDivCode.KRX;
        const response =
            await this.koreaInvestmentQuotationClient.inquireInvestor({
                FID_INPUT_ISCD: stockCode,
                FID_COND_MRKT_DIV_CODE: divCode,
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
}
