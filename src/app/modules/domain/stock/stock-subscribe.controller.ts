import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { assertStockCode } from '@common/domains';
import { ExistingStockGuard } from '@app/common/guards';
import { SubscribeStockUseCase, UnsubscribeStockUseCase } from './use-cases';

@Controller('v1/stocks')
export class StockSubscribeController {
    constructor(
        private readonly subscribeStockUseCase: SubscribeStockUseCase,
        private readonly unsubscribeStockUseCase: UnsubscribeStockUseCase,
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
    @UseGuards(ExistingStockGuard)
    @Post(':stockCode/subscribe')
    public async subscribe(@Param('stockCode') stockCode: string) {
        await this.subscribeStockUseCase.execute(stockCode);
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
    @UseGuards(ExistingStockGuard)
    @Post(':stockCode/unsubscribe')
    public async unsubscribe(@Param('stockCode') stockCode: string) {
        assertStockCode(stockCode);
        await this.unsubscribeStockUseCase.execute(stockCode);
    }
}
