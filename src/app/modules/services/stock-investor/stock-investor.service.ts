import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { toDateYmdByDate, toTimeCodeByDate } from '@common/utils';
import { MarketDivCode } from '@modules/korea-investment/common';
import { KoreaInvestmentQuotationClient } from '@modules/korea-investment/korea-investment-quotation-client';
import { YN } from '@app/common';
import {
    StockDailyInvestor,
    StockDailyInvestorService,
    StockHourForeignerInvestor,
    StockHourForeignerInvestorService,
} from '@app/modules/repositories/stock-investor';
import { StockService } from '@app/modules/repositories/stock';
import {
    DomesticStockInvestorTransformer,
    StockInvestorByEstimateTransformer,
} from '@app/modules/crawlers/stock-crawler/transformers';

@Injectable()
export class StockInvestorService {
    private readonly logger = new Logger(StockInvestorService.name);

    constructor(
        private readonly koreaInvestmentQuotationClient: KoreaInvestmentQuotationClient,
        private readonly stockService: StockService,
        private readonly stockDailyInvestorService: StockDailyInvestorService,
        private readonly stockHourForeignerInvestorService: StockHourForeignerInvestorService,
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
    ): Promise<StockHourForeignerInvestor[]> {
        try {
            const currentDate = new Date();
            const timeCode = toTimeCodeByDate(currentDate);
            if (isNil(timeCode)) {
                return [];
            }

            const stock = await this.stockService.getStock(stockCode);
            if (!stock) {
                throw new NotFoundException(
                    `Stock with code ${stockCode} not found`,
                );
            }

            const dateYmd = toDateYmdByDate({
                date: currentDate,
                separator: '-',
            });

            const isExists =
                await this.stockHourForeignerInvestorService.exists(
                    stockCode,
                    dateYmd,
                    timeCode,
                );

            if (!isExists) {
                await this.fetchAndSaveStockHourInvestorsByEstimate(
                    stockCode,
                    dateYmd,
                );
            }

            return this.stockHourForeignerInvestorService.getListByStockCode(
                stockCode,
                dateYmd,
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
            await this.koreaInvestmentQuotationClient.getInvestorTradeByStockDaily(
                {
                    FID_INPUT_ISCD: stockCode,
                    FID_COND_MRKT_DIV_CODE: divCode,
                    FID_INPUT_DATE_1: toDateYmdByDate({
                        separator: '-',
                    }),
                },
            );

        const transformer = new DomesticStockInvestorTransformer();
        const transformedStockInvestors = response.output2.map((output) =>
            transformer.transform({
                stockCode,
                output,
            }),
        );

        await this.stockDailyInvestorService.upsert(transformedStockInvestors);
    }

    /**
     * 한국투자증권 API를 통해 금일 외국인 동향 정보를 조회하고 저장합니다.
     * @param stockCode
     * @param date
     * @private
     */
    private async fetchAndSaveStockHourInvestorsByEstimate(
        stockCode: string,
        date: string,
    ) {
        const stock = await this.stockService.getStock(stockCode);
        if (isNil(stock)) {
            return [];
        }

        const outputs =
            await this.koreaInvestmentQuotationClient.inquireInvestorByEstimate(
                {
                    MKSC_SHRN_ISCD: stock.shortCode,
                },
            );

        const transformer = new StockInvestorByEstimateTransformer();
        const dtoList = outputs.map((output) => ({
            ...transformer.transform({
                stock,
                output,
            }),
            date,
            stockCode: stock.shortCode,
        }));

        await Promise.all(
            dtoList.map(async (dto) => {
                if (
                    await this.stockHourForeignerInvestorService.exists(
                        stockCode,
                        date,
                        dto.timeCode,
                    )
                ) {
                    return;
                }

                return this.stockHourForeignerInvestorService.insert(dto);
            }),
        );

        return this.stockHourForeignerInvestorService.getListByStockCode(
            stock.shortCode,
            date,
        );
    }
}
