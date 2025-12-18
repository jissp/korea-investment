import { Controller, Get, Logger, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { StockRepository } from '@app/modules/stock-repository';
import { KoreaInvestmentDailyItemChartPriceResponse } from './dto';

@Controller('v1/stocks')
export class StockController {
    private readonly logger = new Logger('StockController');

    constructor(private readonly stockRepository: StockRepository) {}

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
}
