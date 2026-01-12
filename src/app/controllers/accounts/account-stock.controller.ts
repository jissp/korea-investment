import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import {
    AccountService,
    AccountStockService,
} from '@app/modules/repositories/account';
import {
    AccountStockGroupService,
    AccountStockGroupStockService,
} from '@app/modules/repositories/account-stock-group';
import { GetAccountStockGroupsResponse, GetAccountStocksResponse } from './dto';

@Controller('v1/accounts')
export class AccountStockController {
    constructor(
        private readonly accountService: AccountService,
        private readonly accountStockService: AccountStockService,
        private readonly accountStockGroupService: AccountStockGroupService,
        private readonly accountStockGroupStockService: AccountStockGroupStockService,
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
        const accountGroups = await this.accountStockGroupService.getAll();

        return {
            data: accountGroups,
        };
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
        const stocks = await this.accountStockGroupStockService.getAll();

        return {
            data: stocks,
        };
    }

    @ApiOperation({
        summary: '계좌 - 주식 정보 조회',
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
        const stocks =
            await this.accountStockGroupStockService.getAllByGroupCode(
                groupCode,
            );

        return {
            data: stocks,
        };
    }
}
