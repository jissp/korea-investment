import { chunk, groupBy } from 'lodash';
import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import {
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { assertStockCode } from '@common/domains';
import { MarketDivCode, PeriodType } from '@modules/korea-investment/common';
import { KoreaInvestmentQuotationClient } from '@modules/korea-investment/korea-investment-quotation-client';
import { KoreaInvestmentCollectorSocket } from '@app/modules/korea-investment-collector';
import { StockDailyPriceTransformer } from '@app/common';
import { ExistingStockGuard } from '@app/common/guards';
import { MarketType, YN } from '@app/common/types';
import { StockPriceTransformer } from '@app/common/transformers/stock-price.transformer';
import { KoreaInvestmentRequestApiHelper } from '@app/modules/korea-investment-request-api/common';
import { Stock, StockService } from '@app/modules/repositories/stock';
import {
    GetStockDailyPricesResponse,
    GetStockPricesResponse,
    GetStockResponse,
    GetStocksResponse,
} from './dto';

@Controller('v1/stocks')
export class StockController {
    constructor(
        private readonly koreaInvestmentCollectorSocket: KoreaInvestmentCollectorSocket,
        private readonly koreaInvestmentRequestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly koreaInvestmentQuotationClient: KoreaInvestmentQuotationClient,
        private readonly stockService: StockService,
    ) {}

    @ApiOperation({
        summary: '국내 시장 종목 전체 조회',
    })
    @ApiOkResponse({
        type: GetStocksResponse,
    })
    @Get('domestics')
    public async getStocks(): Promise<GetStocksResponse> {
        const stocks = await this.stockService.getStocks({
            marketType: MarketType.Domestic,
        });

        return {
            data: stocks,
        };
    }

    @ApiOperation({
        summary: '국내 시장 종목 검색',
    })
    @ApiParam({
        name: 'stockName',
        type: String,
        description: '종목명',
    })
    @ApiOkResponse({
        type: GetStocksResponse,
    })
    @Get('search/:stockName')
    public async searchStocks(
        @Param('stockName') stockName: string,
    ): Promise<GetStocksResponse> {
        const stocks = await this.stockService.getStocks({
            marketType: MarketType.Domestic,
            name: stockName,
        });

        return {
            data: stocks,
        };
    }

    @ApiOperation({
        summary: '여러 종목 가격 조회',
    })
    @ApiParam({
        name: 'stockCode',
        type: String,
        description: '종목코드',
    })
    @ApiQuery({
        name: 'periodType',
        enum: PeriodType,
        description: '기간 타입(D:일별, W:주별, M:월별)',
    })
    @ApiOkResponse({
        type: GetStockDailyPricesResponse,
    })
    @UseGuards(ExistingStockGuard)
    @Get(':stockCode/daily-prices')
    public async getDailyPriceByStock(
        @Param('stockCode') stockCode: string,
        @Query('periodType') periodType: PeriodType,
    ): Promise<GetStockDailyPricesResponse> {
        const stock = (await this.stockService.getStock(stockCode))!;

        const response =
            await this.koreaInvestmentQuotationClient.inquireDailyPrice({
                FID_COND_MRKT_DIV_CODE:
                    stock.isNextTrade === YN.Y
                        ? MarketDivCode.통합
                        : MarketDivCode.KRX,
                FID_INPUT_ISCD: stock.shortCode,
                FID_ORG_ADJ_PRC: '1',
                FID_PERIOD_DIV_CODE: periodType,
            });

        const transformer = new StockDailyPriceTransformer();
        const stockDailyPriceDtoList = response.output.map((output) =>
            transformer.transform(output),
        );

        return {
            data: stockDailyPriceDtoList,
        };
    }

    @ApiOperation({
        summary: '여러 종목 가격 조회',
    })
    @ApiQuery({
        name: 'stockCodes',
        type: String,
        description: '종목코드 목록. 각 종목 코드는 ,로 구분합니다.',
    })
    @ApiOkResponse({
        type: GetStockPricesResponse,
    })
    @Get('prices')
    public async getStockPrices(
        @Query('stockCodes') stockCodes: string,
    ): Promise<GetStockPricesResponse> {
        const splitStockCodes = stockCodes.split(',');

        const stocks = await this.stockService.getStocksByStockCode({
            marketType: MarketType.Domestic,
            stockCodes: splitStockCodes,
        });
        const groupedStocks = groupBy(stocks, (stock) => stock.isNextTrade);

        const responses = await Promise.all(
            Object.entries(groupedStocks).flatMap(
                ([isNxt, stocks]: [YN, Stock[]]) => {
                    const marketDivCode =
                        isNxt === YN.Y ? MarketDivCode.통합 : MarketDivCode.KRX;
                    const stockChunks = chunk(stocks, 30);

                    return stockChunks.map((stocks) => {
                        const params =
                            this.koreaInvestmentRequestApiHelper.buildIntstockMultiPriceParam(
                                marketDivCode,
                                stocks.map((stock) => stock.shortCode),
                            );

                        return this.koreaInvestmentQuotationClient.inquireIntstockMultiPrice(
                            params,
                        );
                    });
                },
            ),
        );

        const transformer = new StockPriceTransformer();
        const stockPriceDtoList = responses
            .flat()
            .map((output) => transformer.transform(output));

        return {
            data: stockPriceDtoList,
        };
    }

    @ApiOperation({
        summary: '종목 조회',
    })
    @ApiParam({
        name: 'stockCode',
        type: String,
        description: '종목코드',
    })
    @ApiOkResponse({
        type: GetStockResponse,
    })
    @Get(':stockCode')
    public async getStock(
        @Param('stockCode') stockCode: string,
    ): Promise<GetStockResponse> {
        const stock = await this.stockService.getStock(stockCode);

        return {
            data: stock,
        };
    }

    @ApiOperation({
        summary: '종목 구독',
    })
    @ApiParam({
        name: 'stockCode',
        type: String,
        description: '종목 코드',
    })
    @ApiNoContentResponse()
    @UseGuards(ExistingStockGuard)
    @Post(':stockCode/subscribe')
    public async subscribe(@Param('stockCode') stockCode: string) {
        await this.koreaInvestmentCollectorSocket.subscribe(stockCode);
    }

    @ApiOperation({
        summary: '종목 구독 해제',
    })
    @ApiParam({
        name: 'stockCode',
        type: String,
        description: '종목 코드',
    })
    @ApiNoContentResponse()
    @UseGuards(ExistingStockGuard)
    @Post(':stockCode/unsubscribe')
    public async unsubscribe(@Param('stockCode') stockCode: string) {
        assertStockCode(stockCode);

        await this.koreaInvestmentCollectorSocket.unsubscribe(stockCode);
    }
}
