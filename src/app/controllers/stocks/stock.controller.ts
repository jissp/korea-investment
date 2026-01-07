import {
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import {
    ApiNoContentResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
} from '@nestjs/swagger';
import { assertStockCode } from '@common/domains';
import { KoreaInvestmentCollectorSocket } from '@app/modules/korea-investment-collector';
import { StockInvestorService } from '@app/modules/services/stock-investor';
import { StockInvestorResponse } from './dto';

@Controller('v1/stocks')
export class StockController {
    constructor(
        private readonly koreaInvestmentCollectorSocket: KoreaInvestmentCollectorSocket,
        private readonly stockInvestorService: StockInvestorService,
    ) {}

    @ApiOperation({
        summary: '종목 구독',
    })
    @ApiParam({
        name: 'stockCode',
        type: String,
        description: '종목 코드',
    })
    @ApiNoContentResponse()
    @Post(':stockCode/subscribe')
    public async subscribe(@Param('stockCode') stockCode: string) {
        assertStockCode(stockCode);

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
    @Post(':stockCode/unsubscribe')
    public async unsubscribe(@Param('stockCode') stockCode: string) {
        assertStockCode(stockCode);

        await this.koreaInvestmentCollectorSocket.unsubscribe(stockCode);
    }

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
        description: '조회할 최대 개수 (기본값: 30)',
        example: 30,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: StockInvestorResponse,
        description: '투자자 동향 데이터 (날짜 내림차순)',
    })
    @Get(':stockCode/investors')
    public async getStockInvestors(
        @Param('stockCode') stockCode: string,
        @Query('limit') limit?: number,
    ): Promise<StockInvestorResponse> {
        assertStockCode(stockCode);

        const stockInvestors =
            await this.stockInvestorService.getDailyInvestors(
                stockCode,
                limit ?? 30,
            );

        return {
            data: stockInvestors,
        };
    }
}
