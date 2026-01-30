import { Injectable } from '@nestjs/common';
import { getMarketDivCodeByIsNextTrade } from '@common/domains';
import { toDateYmdByDate } from '@common/utils';
import {
    DomesticStockInvestorTrendEstimateOutput2,
    KoreaInvestmentQuotationClient,
} from '@modules/korea-investment/korea-investment-quotation-client';
import { MarketType } from '@app/common';
import { Stock, StockService } from '@app/modules/repositories/stock';
import {
    FavoriteStock,
    FavoriteStockService,
} from '@app/modules/repositories/favorite-stock';
import {
    StockDailyInvestor,
    StockDailyInvestorService,
    StockHourForeignerInvestor,
    StockHourForeignerInvestorService,
} from '@app/modules/repositories/stock-investor';
import { ThemeService, ThemeStock } from '@app/modules/repositories/theme';
import {
    DomesticStockInvestorTransformer,
    StockInvestorByEstimateTransformer,
} from '@app/modules/crawlers/stock-crawler';
import { TransformByInvestorHelper } from '@app/modules/ai-analyzer';
import { StockExhaustionTraceData } from './exhaustion-trace-analyzer-helper.types';

@Injectable()
export class ExhaustionTraceAnalyzerHelper {
    constructor(
        private readonly koreaInvestmentQuotationClient: KoreaInvestmentQuotationClient,
        private readonly helper: TransformByInvestorHelper,
        private readonly stockService: StockService,
        private readonly favoriteStockService: FavoriteStockService,
        private readonly stockDailyInvestorService: StockDailyInvestorService,
        private readonly stockHourForeignerInvestorService: StockHourForeignerInvestorService,
        private readonly themeService: ThemeService,
    ) {}

    /**
     * 종목 목록을 조회합니다.
     * @param stockCodes
     */
    public async getStocks(stockCodes: string[]): Promise<Stock[]> {
        return this.stockService.getStocksByStockCode({
            marketType: MarketType.Domestic,
            stockCodes,
        });
    }

    /**
     * 즐겨찾기 종목 목록을 조회합니다.
     */
    public async getFavoriteStocks(): Promise<FavoriteStock[]> {
        return this.favoriteStockService.findAll();
    }

    /**
     * 특정 테마에 속한 종목 목록을 조회합니다.
     * @param themeCode
     */
    public async getThemeStocksByThemeCode(
        themeCode: string,
    ): Promise<ThemeStock[]> {
        return this.themeService.getThemeStocksByThemeCode(themeCode);
    }

    /**
     * DB에서 종목별 투자자 동향을 조회합니다.
     * @param stocks
     */
    public async getStockInvestors(
        stocks: Stock[],
    ): Promise<StockDailyInvestor[]> {
        const stockCodes = stocks.map((stock) => stock.shortCode);

        return this.stockDailyInvestorService.getStockDailyInvestorsByDays({
            days: 7,
            stockCodes,
        });
    }

    /**
     * 한국투자증권 API를 ㅌ오해서 종목별 투자자 동향을 조회합니다.
     * @param stocks
     */
    public async getStockInvestorsFromApi(
        stocks: Stock[],
    ): Promise<StockDailyInvestor[]> {
        const transformer = new DomesticStockInvestorTransformer();

        const rawStockInvestorOutputs = await this.fetchStockInvestors(stocks);

        const currentDate = new Date();

        return rawStockInvestorOutputs.flatMap((outputs, index) => {
            return outputs.map((output) => ({
                id: 0,
                ...transformer.transform({
                    stockCode: stocks[index].shortCode,
                    output,
                }),
                createdAt: currentDate,
            }));
        });
    }

    /**
     * 한국투자증권 API에서 종목별 투자자 동향을 조회합니다.
     * @param stocks
     */
    public async fetchStockInvestors(stocks: Stock[]) {
        return Promise.all(
            stocks.map((stock) =>
                this.koreaInvestmentQuotationClient.inquireInvestor({
                    FID_INPUT_ISCD: stock.shortCode,
                    FID_COND_MRKT_DIV_CODE: getMarketDivCodeByIsNextTrade(
                        stock.isNextTrade,
                    ),
                }),
            ),
        );
    }

    /**
     * 금일(혹은 최근 영업일) 기준으로 시간별 외국인 동향 정보를 조회합니다.
     * @param stocks
     */
    public async getStockHourForeignerInvestorsByStocks(
        stocks: Stock[],
    ): Promise<StockHourForeignerInvestor[]> {
        const stockCodes = stocks.map((stock) => stock.shortCode);

        return this.stockHourForeignerInvestorService.getStockHourForeignerInvestorsByStockCodes(
            stockCodes,
        );
    }

    /**
     * 한국투자증권 API를 통해서 금일(혹은 최근 영업일) 기준으로 시간별 외국인 동향 정보를 조회합니다.
     * @param stocks
     */
    public async getStockHourForeignerInvestorsByStocksFromApi(
        stocks: Stock[],
    ): Promise<StockHourForeignerInvestor[]> {
        const transformer = new StockInvestorByEstimateTransformer();

        const rawStockInvestors =
            await this.fetchRawStockInvestorsByEstimate(stocks);

        const currentDate = new Date();
        const currentDateYmd = toDateYmdByDate({
            date: currentDate,
            separator: '-',
        });

        return rawStockInvestors.flatMap((outputs, index) =>
            outputs.map((output) => ({
                id: 0,
                date: currentDateYmd,
                ...transformer.transform({
                    stock: stocks[index],
                    output,
                }),
                createdAt: currentDate,
            })),
        );
    }

    /**
     * 한국투자증권 API에서 금일(혹은 최근 영업일) 기준으로 시간별 외국인 동향 정보를 조회합니다.
     * @param stocks
     */
    public async fetchRawStockInvestorsByEstimate(
        stocks: Stock[],
    ): Promise<DomesticStockInvestorTrendEstimateOutput2[][]> {
        return Promise.all(
            stocks.map((stock) =>
                this.koreaInvestmentQuotationClient.inquireInvestorByEstimate({
                    MKSC_SHRN_ISCD: stock.shortCode,
                }),
            ),
        );
    }

    public extractInvestorPrompts(filteredStocks: StockExhaustionTraceData[]) {
        return filteredStocks
            .map((stock) => this.extractInvestorPrompt(stock))
            .join('\n\n');
    }

    public extractInvestorPrompt(stock: StockExhaustionTraceData): string {
        const stockInvestorPrompt = stock.investors
            .map((inv) => {
                return `- ${inv.date}: 종가: ${inv.price}, 개인: ${inv.person}, 외국인: ${inv.foreigner}, 기관: ${inv.organization}`;
            })
            .join('\n');

        const hourForeignerInvestorPrompt =
            this.extractInvestorPromptByHourForeigner(stock);

        return `**${stock.stockName}** \n${hourForeignerInvestorPrompt}\n일별 동향 \n${stockInvestorPrompt}`;
    }

    public extractInvestorPromptByHourForeigner(
        stock: StockExhaustionTraceData,
    ): string {
        if (stock.hourForeignerInvestors.length === 0) {
            return '';
        }

        const hourForeignerInvestorPrompt = stock.hourForeignerInvestors
            .map(({ timeCode, foreigner, organization }) => {
                const hour = this.helper.hourGbToTime(timeCode);

                return `- ${hour}: 외국인: ${foreigner}, 외국계 기관: ${organization}`;
            })
            .join('\n');

        return `\n오늘(최근 영업일) 시간별 동향 \n${hourForeignerInvestorPrompt}\n`;
    }
}
