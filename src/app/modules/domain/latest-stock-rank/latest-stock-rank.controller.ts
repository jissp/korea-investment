import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import {
    GetMostViewedStocksUseCase,
    GetTradingVolumeRanksUseCase,
} from './use-cases';
import {
    GetMostViewedStocksResponse,
    GetTradingVolumeRanksResponse,
} from './dto';

@Controller('v1/latest-stock-rank')
export class LatestStockRankController {
    constructor(
        private readonly getMostViewedStocksUseCase: GetMostViewedStocksUseCase,
        private readonly getTradingVolumeRanksUseCase: GetTradingVolumeRanksUseCase,
    ) {}

    @ApiOperation({
        summary: 'HTS 조회 상위 20 종목 랭킹 조회',
    })
    @ApiOkResponse({
        type: GetMostViewedStocksResponse,
    })
    @Get('most-viewed-stocks')
    async getMostViewedStocks(): Promise<GetMostViewedStocksResponse> {
        return this.getMostViewedStocksUseCase.execute({ limit: 20 });
    }

    @ApiOperation({
        summary: '거래량 순위 랭킹 조회',
    })
    @ApiOkResponse({
        type: GetTradingVolumeRanksResponse,
    })
    @Get('volume-ranks')
    async getKoreaInvestmentVolumeRanks(): Promise<GetTradingVolumeRanksResponse> {
        return this.getTradingVolumeRanksUseCase.execute({ limit: 30 });
    }
}
