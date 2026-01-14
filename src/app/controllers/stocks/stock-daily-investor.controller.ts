import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { ExistingStockGuard } from '@app/common';
import { StockService } from '@app/modules/repositories/stock';
import { StockInvestorService } from '@app/modules/services/stock-investor';
import { GetStockInvestorsResponse } from './dto';
import { GetStockInvestorByEstimateResponse } from '@app/controllers/stocks/dto/responses/get-stock-investor-by-estimate.response';

@Controller('v1/stocks')
export class StockDailyInvestorController {
    constructor(
        private readonly stockService: StockService,
        private readonly stockInvestorService: StockInvestorService,
    ) {}

    @ApiOperation({
        summary: '투자자 동향 조회',
        description: '',
    })
    @ApiParam({
        name: 'stockCode',
        type: String,
        description: '종목 코드 (예: 005930)',
        example: '005930',
    })
    @ApiQuery({
        name: 'limit',
        type: Number,
        required: false,
        description: '조회할 최대 개수 (기본값: 7)',
        example: 7,
    })
    @ApiOkResponse({
        type: GetStockInvestorsResponse,
        description: '투자자 동향 데이터 (날짜 내림차순)',
    })
    @UseGuards(ExistingStockGuard)
    @Get(':stockCode/investors')
    public async getStockInvestors(
        @Param('stockCode') stockCode: string,
        @Query('limit') limit?: number,
    ): Promise<GetStockInvestorsResponse> {
        const stockInvestors =
            await this.stockInvestorService.getDailyInvestors(stockCode, limit);

        return {
            data: stockInvestors,
        };
    }

    @ApiOperation({
        summary: '금일 종목별 외인기관 추정가집계 조회',
        description: '',
    })
    @ApiParam({
        name: 'stockCode',
        type: String,
        description: '종목 코드 (예: 005930)',
        example: '005930',
    })
    @ApiOkResponse({
        type: GetStockInvestorByEstimateResponse,
    })
    @UseGuards(ExistingStockGuard)
    @Get(':stockCode/investors/estimate')
    public async getStockInvestorByEstimate(
        @Param('stockCode') stockCode: string,
    ): Promise<GetStockInvestorByEstimateResponse> {
        const stockInvestors =
            await this.stockInvestorService.getDailyInvestorByEstimate(
                stockCode,
            );

        return {
            data: stockInvestors,
        };
    }
}
