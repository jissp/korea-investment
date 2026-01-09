import { Controller, Get, Param, Query } from '@nestjs/common';
import {
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { assertStockCode } from '@common/domains';
import { StockInvestorService } from '@app/modules/services/stock-investor';
import { StockInvestorsResponse } from './dto';

@Controller('v1/stocks')
export class StockDailyInvestorController {
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
        type: StockInvestorsResponse,
        description: '투자자 동향 데이터 (날짜 내림차순)',
    })
    @Get(':stockCode/investors')
    public async getStockInvestors(
        @Param('stockCode') stockCode: string,
        @Query('limit') limit?: number,
    ): Promise<StockInvestorsResponse> {
        assertStockCode(stockCode);

        const stockInvestors =
            await this.stockInvestorService.getDailyInvestors(stockCode, limit);

        return {
            data: stockInvestors,
        };
    }
}
