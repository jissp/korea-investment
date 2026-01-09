import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { MarketIndexService } from '@app/modules/repositories/market-index';
import { GetMarketIndicesResponse } from './dto';

@Controller('v1/markets/indices')
export class MarketIndexController {
    private readonly logger = new Logger(MarketIndexController.name);

    constructor(private readonly marketIndexService: MarketIndexService) {}

    @ApiOperation({
        summary: '국내 업종 시세 조회',
    })
    @ApiOkResponse({
        type: GetMarketIndicesResponse,
    })
    @Get('domestics')
    public async getDomesticIndices(): Promise<GetMarketIndicesResponse> {
        const marketIndices =
            await this.marketIndexService.getTodayDomesticIndices();

        return {
            data: marketIndices,
        };
    }

    @ApiOperation({
        summary: '해외 업종 시세 조회',
    })
    @ApiOkResponse({
        type: GetMarketIndicesResponse,
    })
    @Get('overseas')
    public async getOverseasIndices(): Promise<GetMarketIndicesResponse> {
        const marketIndices =
            await this.marketIndexService.getTodayOverseasIndices();

        return {
            data: marketIndices,
        };
    }

    @ApiOperation({
        summary: '미국 국채 지수 조회',
    })
    @ApiOkResponse({
        type: GetMarketIndicesResponse,
    })
    @Get('overseas/government-bonds')
    public async getOverseasGovernmentBonds(): Promise<GetMarketIndicesResponse> {
        const overseasGovernmentBondsIndices =
            await this.marketIndexService.getTodayGovernmentBonds();

        return {
            data: overseasGovernmentBondsIndices,
        };
    }
}
