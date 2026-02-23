import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { PeriodType } from '@modules/korea-investment/common';
import { ExistingStockGuard } from '@app/common/guards';
import {
    GetStockDailyPricesResponse,
    GetStockPricesResponse,
    GetStockResponse,
    GetStockScoresResponse,
    GetStocksResponse,
} from './dto';
import {
    GetDailyPricesUseCase,
    GetStockPricesUseCase,
    GetStockScoresUseCase,
    GetStocksUseCase,
    GetStockUseCase,
    SearchStocksUseCase,
} from './use-cases';

@Controller('v1/stocks')
export class StockController {
    constructor(
        private readonly getStocksUseCase: GetStocksUseCase,
        private readonly searchStocksUseCase: SearchStocksUseCase,
        private readonly getDailyPricesUseCase: GetDailyPricesUseCase,
        private readonly getStockPricesUseCase: GetStockPricesUseCase,
        private readonly getStockScoresUseCase: GetStockScoresUseCase,
        private readonly getStockUseCase: GetStockUseCase,
    ) {}

    @ApiOperation({
        summary: '국내 시장 종목 전체 조회',
    })
    @ApiOkResponse({
        type: GetStocksResponse,
    })
    @Get('domestics')
    public async getStocks(): Promise<GetStocksResponse> {
        const stocks = await this.getStocksUseCase.execute();
        return { data: stocks };
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
        const stocks = await this.searchStocksUseCase.execute({ stockName });
        return { data: stocks };
    }

    @ApiOperation({
        summary: '종목의 일별/주별/월별 시세 조회',
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
        const data = await this.getDailyPricesUseCase.execute({
            stockCode,
            periodType,
        });
        return { data };
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
        const data = await this.getStockPricesUseCase.execute({ stockCodes });
        return { data };
    }

    @ApiOperation({
        summary: '종목 점수 조회',
    })
    @ApiParam({
        name: 'stockCode',
        type: String,
        description: '종목코드',
    })
    @ApiOkResponse({
        type: GetStockScoresResponse,
    })
    @UseGuards(ExistingStockGuard)
    @Get(':stockCode/scores')
    public async getStockScores(
        @Param('stockCode') stockCode: string,
    ): Promise<GetStockScoresResponse> {
        const data = await this.getStockScoresUseCase.execute(stockCode);
        return { data };
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
    @UseGuards(ExistingStockGuard)
    @Get(':stockCode')
    public async getStock(
        @Param('stockCode') stockCode: string,
    ): Promise<GetStockResponse> {
        const data = await this.getStockUseCase.execute(stockCode);
        return { data };
    }
}
