import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
    ApiBody,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
} from '@nestjs/swagger';
import { StockRepository } from '@app/modules/stock-repository';
import { StockService } from '@app/modules/stock';
import { StockKeywordService } from '@app/modules/stock-keyword';
import {
    GetCodesResponse,
    KoreaInvestmentDailyItemChartPriceResponse,
    RegisterStockKeywordBody,
} from './dto';

@Controller('v1/stocks')
export class StockController {
    constructor(
        private readonly stockRepository: StockRepository,
        private readonly stockService: StockService,
        private readonly stockKeywordService: StockKeywordService,
    ) {}

    @ApiOperation({
        summary: '주식일별분봉조회',
    })
    @ApiParam({
        name: 'stockCode',
        type: String,
        description: '종목 코드',
    })
    @ApiOkResponse({
        type: KoreaInvestmentDailyItemChartPriceResponse,
    })
    @Get('daily-prices/:stockCode')
    public async getStockDailyPrices(
        @Param('stockCode') stockCode: string,
    ): Promise<KoreaInvestmentDailyItemChartPriceResponse> {
        const dailyStockChart =
            await this.stockRepository.getDailyStockChart(stockCode);
        if (!dailyStockChart) {
            return {
                data: null,
            };
        }

        return {
            data: {
                data1: dailyStockChart.output,
                data2: dailyStockChart.output2,
            },
        };
    }

    @ApiOperation({
        summary: '관심있는 종목 추가',
        description:
            '관심있는 종목 코드를 추가합니다. 추가된 종목은 주기적으로 뉴스 정보 등을 수집하는데 사용됩니다.',
    })
    @ApiParam({
        name: 'stockCode',
        type: String,
        description: '종목 코드',
    })
    @ApiCreatedResponse()
    @Post('favorite-stocks/:stockCode')
    public async registerFavoriteStockCode(
        @Param('stockCode') stockCode: string,
    ) {
        await this.stockService.addStockCode(stockCode);
    }

    @ApiOperation({
        summary: '관심있는 종목 제거',
        description: '관심있는 종목 코드를 제거합니다.',
    })
    @ApiParam({
        name: 'stockCode',
        type: String,
        description: '종목 코드',
    })
    @ApiNoContentResponse()
    @Delete('favorite-stocks/:stockCode')
    public async deleteFavoriteStockCode(
        @Param('stockCode') stockCode: string,
    ) {
        await this.stockService.deleteStockCode(stockCode);
    }

    @ApiOperation({
        summary: '관심있는 종목 목록 조회',
        description: '관심있는 종목 코드들을 조회합니다.',
    })
    @ApiOkResponse({
        type: GetCodesResponse,
    })
    @Get('favorite-stocks')
    public async getFavoriteStockCodes(): Promise<GetCodesResponse> {
        const codes = await this.stockService.getStockCodes();

        return {
            data: codes.map((code) => ({
                code,
            })),
        };
    }

    @ApiOperation({
        summary: '키워드 추가',
        description:
            '키워드를 추가합니다. 추가된 키워드는 주기적으로 뉴스 정보 등을 수집하는데 사용됩니다.',
    })
    @ApiParam({
        name: 'stockCode',
        type: String,
        description: '종목 코드',
    })
    @ApiBody({
        type: RegisterStockKeywordBody,
    })
    @ApiCreatedResponse()
    @Post(':stockCode/keywords')
    public async registerKeyword(
        @Param('stockCode') stockCode: string,
        @Body() body: RegisterStockKeywordBody,
    ) {
        await this.stockKeywordService.addStockKeyword(stockCode, body.keyword);
    }

    @ApiOperation({
        summary: '키워드 제거',
        description: '키워드를 제거합니다.',
    })
    @ApiParam({
        name: 'stockCode',
        type: String,
        description: '종목 코드',
    })
    @ApiParam({
        name: 'keyword',
        type: String,
        description: '키워드',
    })
    @ApiNoContentResponse()
    @Delete(':stockCode/keywords/:keyword')
    public async deleteKeyword(
        @Param('stockCode') stockCode: string,
        @Param('keyword') keyword: string,
    ) {
        await this.stockKeywordService.deleteStockKeyword(stockCode, keyword);
    }

    @ApiOperation({
        summary: '키워드 목록 조회',
        description: '키워드 목록을 조회합니다.',
    })
    @ApiParam({
        name: 'stockCode',
        type: String,
        description: '종목 코드',
    })
    @ApiOkResponse({
        type: GetCodesResponse,
    })
    @Get(':stockCode/keywords')
    public async getKeywords(
        @Param('stockCode') stockCode: string,
    ): Promise<GetCodesResponse> {
        const keywords =
            await this.stockKeywordService.getStockKeywords(stockCode);

        return {
            data: keywords.map((keyword) => ({
                code: keyword,
            })),
        };
    }
}
