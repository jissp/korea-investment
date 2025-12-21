import { Controller, Get, Param, Post } from '@nestjs/common';
import {
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
} from '@nestjs/swagger';
import { assertStockCode } from '@common/domains';
import { StockRepository } from '@app/modules/stock-repository';
import { KoreaInvestmentCollectorSocket } from '@app/modules/korea-investment-collector';
import { KoreaInvestmentDailyItemChartPriceResponse } from './dto';

@Controller('v1/stocks')
export class StockController {
    constructor(
        private readonly koreaInvestmentCollectorSocket: KoreaInvestmentCollectorSocket,
        private readonly stockRepository: StockRepository,
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
