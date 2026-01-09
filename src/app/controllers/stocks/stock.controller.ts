import { Controller, Param, Post } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { assertStockCode } from '@common/domains';
import { KoreaInvestmentCollectorSocket } from '@app/modules/korea-investment-collector';

@Controller('v1/stocks')
export class StockController {
    constructor(
        private readonly koreaInvestmentCollectorSocket: KoreaInvestmentCollectorSocket,
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
}
