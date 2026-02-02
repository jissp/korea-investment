import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { ExistingStockGuard } from '@app/common/guards';
import { StockInvestorService } from '@app/modules/app-services/stock-investor';
import { GetStockInvestorsResponse } from './dto';

@Controller('v1/stocks')
export class StockInvestorController {
    constructor(private readonly stockInvestorService: StockInvestorService) {}

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
}
