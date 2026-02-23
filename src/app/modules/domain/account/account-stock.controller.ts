import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import {
    GetAccountStockGroupsUseCase,
    GetAccountStocksByGroupUseCase,
    GetAccountStocksUseCase,
} from './use-cases';
import { GetAccountStockGroupsResponse, GetAccountStocksResponse } from './dto';

@Controller('v1/accounts')
export class AccountStockController {
    constructor(
        private readonly getAccountStockGroupsUseCase: GetAccountStockGroupsUseCase,
        private readonly getAccountStocksUseCase: GetAccountStocksUseCase,
        private readonly getAccountStocksByGroupUseCase: GetAccountStocksByGroupUseCase,
    ) {}

    @ApiOperation({
        summary: '계좌 - 관심 그룹 목록을 조회합니다.',
        description: '계좌의 관심 그룹 목록을 조회합니다.',
    })
    @ApiOkResponse({
        type: GetAccountStockGroupsResponse,
    })
    @Get('groups')
    public async getAccountStockGroups(): Promise<GetAccountStockGroupsResponse> {
        return await this.getAccountStockGroupsUseCase.execute();
    }

    @ApiOperation({
        summary: '계좌 - 주식 정보 조회',
        description: '계좌의 관심 그룹에 등록된 종목 정보를 조회합니다.',
    })
    @ApiOkResponse({
        type: GetAccountStocksResponse,
    })
    @Get('stocks')
    public async getAccountStocks(): Promise<GetAccountStocksResponse> {
        return await this.getAccountStocksUseCase.execute();
    }

    @ApiOperation({
        summary: '계좌 - 관심 그룹 종목 조회',
        description: '계좌의 관심 그룹에 등록된 종목 정보를 조회합니다.',
    })
    @ApiParam({
        name: 'groupCode',
        type: String,
        description: '계좌의 관심 그룹 ID',
        required: true,
    })
    @ApiOkResponse({
        type: GetAccountStocksResponse,
    })
    @Get('stocks/:groupCode')
    public async getAccountStocksByGroup(
        @Param('groupCode') groupCode: string,
    ): Promise<GetAccountStocksResponse> {
        return await this.getAccountStocksByGroupUseCase.execute({
            groupCode,
        });
    }
}
