import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { MostViewedStockService } from '@app/modules/repositories/most-viewed-stock';
import { TradingVolumeRankService } from '@app/modules/repositories/trading-volume-rank';
import {
    GetMostViewedStocksResponse,
    GetTradingVolumeRanksResponse,
} from './dto';

@Controller('v1/latest-stock-rank')
export class LatestStockRankController {
    constructor(
        private readonly mostViewedStockService: MostViewedStockService,
        private readonly tradingVolumeRankService: TradingVolumeRankService,
    ) {}

    @ApiOperation({
        summary: 'HTS 조회 상위 20 종목 랭킹 조회',
    })
    @ApiOkResponse({
        type: GetMostViewedStocksResponse,
    })
    @Get('most-viewed-stocks')
    public async getMostViewedStocks(): Promise<GetMostViewedStocksResponse> {
        const mostViewedStocks =
            await this.mostViewedStockService.getLatestMostViewedStocks(20);

        return {
            data: mostViewedStocks,
        };
    }

    @ApiOperation({
        summary: '거래량 순위 랭킹 조회',
    })
    @ApiOkResponse({
        type: GetTradingVolumeRanksResponse,
    })
    @Get('volume-ranks')
    public async getKoreaInvestmentVolumeRanks(): Promise<GetTradingVolumeRanksResponse> {
        const tradingVolumeRanks =
            await this.tradingVolumeRankService.getLatestTradingVolumeRanks(30);

        return {
            data: tradingVolumeRanks,
        };
    }
}
