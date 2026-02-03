import { Injectable } from '@nestjs/common';
import { getMarketDivCodeByIsNextTrade } from '@common/domains';
import { toDateYmdByDate } from '@common/utils';
import { KoreaInvestmentQuotationClient } from '@modules/korea-investment/korea-investment-quotation-client';
import { MarketType } from '@app/common/types';
import { StockInvestorTransformer } from '@app/common/korea-investment';
import { Stock, StockService } from '@app/modules/repositories/stock';
import {
    FavoriteStock,
    FavoriteStockService,
} from '@app/modules/repositories/favorite-stock';
import {
    StockInvestor,
    StockInvestorService,
} from '@app/modules/repositories/stock-investor';
import { ThemeService, ThemeStock } from '@app/modules/repositories/theme';
import { StockExhaustionTraceData } from './exhaustion-trace-analyzer-helper.types';

const FieldMap = {
    price: '종목 종가',
    highPrice: '종목 고가',
    lowPrice: '종목 저가',
    person: '개인 순매수량',
    foreigner: '외국인 순매수량',
    financialInvestment: '증권 순매수량',
    investmentTrust: '투자신탁 순매수량',
    privateEquity: '사모 펀드 순매수량',
    bank: '은행 순매수량',
    insurance: '보험 순매수량',
    merchantBank: '종금 순매수량',
    fund: '기금 순매수량',
    etc: '기타 순매수량',
};

@Injectable()
export class ExhaustionTraceAnalyzerHelper {
    constructor(
        private readonly koreaInvestmentQuotationClient: KoreaInvestmentQuotationClient,
        private readonly stockService: StockService,
        private readonly favoriteStockService: FavoriteStockService,
        private readonly stockInvestorService: StockInvestorService,
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
    public async getStockInvestors(stocks: Stock[]): Promise<StockInvestor[]> {
        const stockCodes = stocks.map((stock) => stock.shortCode);

        return this.stockInvestorService.getListByDays({
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
    ): Promise<StockInvestor[]> {
        const transformer = new StockInvestorTransformer();

        const responses = await this.fetchStockInvestors(stocks);

        const currentDate = new Date();

        return responses.flatMap(({ output2 }, index) => {
            return output2.map((output) => ({
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
        const todayYmd = toDateYmdByDate({
            separator: '-',
        });

        return Promise.all(
            stocks.map((stock) =>
                this.koreaInvestmentQuotationClient.getInvestorTradeByStockDaily(
                    {
                        FID_INPUT_ISCD: stock.shortCode,
                        FID_COND_MRKT_DIV_CODE: getMarketDivCodeByIsNextTrade(
                            stock.isNextTrade,
                        ),
                        FID_INPUT_DATE_1: todayYmd,
                    },
                ),
            ),
        );
    }

    public extractInvestorPrompts(filteredStocks: StockExhaustionTraceData[]) {
        return filteredStocks
            .map((stock) => this.extractInvestorPrompt(stock))
            .join('\n\n');
    }

    public extractInvestorPrompt(stock: StockExhaustionTraceData): string {
        const fields = Object.entries(FieldMap);
        const stockInvestorPrompt = stock.investors
            .map((investor) => {
                const fieldPrompts = fields.map(([field, fieldName]) => {
                    return `${fieldName}: ${investor[field]}`;
                });

                return `- **${investor.date}**: ${fieldPrompts.join(', ')}`;
            })
            .join('\n');

        return `**${stock.stockName}** \n일별 동향 \n${stockInvestorPrompt}`;
    }
}
