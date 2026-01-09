import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { StockRepository } from '@app/modules/repositories/stock-repository';
import {
    KoreaInvestmentPopulatedHtsTopViewResponse,
    KoreaInvestmentPopulatedVolumeRankResponse,
} from './dto';

@Controller('v1/latest-stock-rank')
export class LatestStockRankController {
    constructor(private readonly stockRepository: StockRepository) {}

    @ApiOperation({
        summary: 'HTS 조회 상위 20 종목 랭킹 조회',
    })
    @ApiOkResponse({
        type: KoreaInvestmentPopulatedHtsTopViewResponse,
    })
    @Get('hts-top-view')
    public async getKoreaInvestmentHtsTopView(): Promise<KoreaInvestmentPopulatedHtsTopViewResponse> {
        return {
            data: await this.stockRepository.getPopulatedHtsTopView(),
        };
    }

    @ApiOperation({
        summary: '거래량 순위 랭킹 조회',
    })
    @ApiOkResponse({
        type: KoreaInvestmentPopulatedVolumeRankResponse,
    })
    @Get('volume')
    public async getKoreaInvestmentVolume(): Promise<KoreaInvestmentPopulatedVolumeRankResponse> {
        return {
            data: await this.stockRepository.getPopulatedVolumeRank(),
        };
    }
}
