import { Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import {
    ApiNoContentResponse,
    ApiOperation,
    ApiParam,
    ApiResponse,
} from '@nestjs/swagger';
import { assertStockCode } from '@common/domains';
import { KoreaInvestmentCollectorSocket } from '@app/modules/korea-investment-collector';
import { GetStocksResponse } from '@app/controllers';
import { StockService } from '@app/modules/repositories/stock';
import { MarketType } from '@app/common/types';

@Controller('v1/stocks')
export class StockController {
    constructor(
        private readonly koreaInvestmentCollectorSocket: KoreaInvestmentCollectorSocket,
        private readonly stockService: StockService,
    ) {}

    @ApiOperation({
        summary: '국내 시장 종목 전체 조회',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: GetStocksResponse,
    })
    @Get('domestics')
    public async getStocksByDomestic(): Promise<GetStocksResponse> {
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
    @ApiResponse({
        status: HttpStatus.OK,
        type: GetStocksResponse,
    })
    @Get('domestics/:stockName')
    public async searchStocksByDomestic(
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
}
