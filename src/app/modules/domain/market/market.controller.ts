import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import {
    GetDomesticIndicesUseCase,
    GetMarketCalendarUseCase,
    GetOverseasGovernmentBondsUseCase,
    GetOverseasIndicesUseCase,
} from './use-cases';
import { GetMarketCalendarResponse, GetMarketIndicesResponse } from './dto';

@Controller('v1/markets')
export class MarketController {
    private readonly logger = new Logger(MarketController.name);

    constructor(
        private readonly getMarketCalendarUseCase: GetMarketCalendarUseCase,
        private readonly getDomesticIndicesUseCase: GetDomesticIndicesUseCase,
        private readonly getOverseasIndicesUseCase: GetOverseasIndicesUseCase,
        private readonly getOverseasGovernmentBondsUseCase: GetOverseasGovernmentBondsUseCase,
    ) {}

    @ApiOperation({
        summary: '오늘 마켓 시장 정보 조회',
    })
    @ApiOkResponse({
        type: GetMarketCalendarResponse,
    })
    @Get()
    public async getTodayBusinessDay(): Promise<GetMarketCalendarResponse> {
        return this.getMarketCalendarUseCase.execute();
    }

    @ApiOperation({
        summary: '국내 업종 시세 조회',
    })
    @ApiOkResponse({
        type: GetMarketIndicesResponse,
    })
    @Get('indices/domestics')
    public async getDomesticIndices(): Promise<GetMarketIndicesResponse> {
        return this.getDomesticIndicesUseCase.execute();
    }

    @ApiOperation({
        summary: '해외 업종 시세 조회',
    })
    @ApiOkResponse({
        type: GetMarketIndicesResponse,
    })
    @Get('indices/overseas')
    public async getOverseasIndices(): Promise<GetMarketIndicesResponse> {
        return this.getOverseasIndicesUseCase.execute();
    }

    @ApiOperation({
        summary: '미국 국채 지수 조회',
    })
    @ApiOkResponse({
        type: GetMarketIndicesResponse,
    })
    @Get('indices/overseas/government-bonds')
    public async getOverseasGovernmentBonds(): Promise<GetMarketIndicesResponse> {
        return this.getOverseasGovernmentBondsUseCase.execute();
    }
}
