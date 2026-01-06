import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
    ApiBody,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
} from '@nestjs/swagger';
import { GetCodesResponse } from '@app/common';
import { KoreaInvestmentKeywordSettingService } from '@app/modules/korea-investment-setting';
import { assertStockCode } from '@common/domains';
import {
    CreateKeywordGroupBody,
    UpsertKeywordBody,
    UpsertKeywordByStockCodeBody,
} from './dto';

@Controller('v1/keyword-groups')
export class KeywordGroupController {
    constructor(
        private readonly keywordSettingService: KoreaInvestmentKeywordSettingService,
    ) {}

    @ApiOperation({
        summary: '키워드 그룹 목록 조회',
        description: '등록된 키워드 그룹 목록을 조회합니다.',
    })
    @ApiOkResponse({
        type: GetCodesResponse,
    })
    @Get()
    public async getKeywordGroups(): Promise<GetCodesResponse> {
        const groups = await this.keywordSettingService.getKeywordGroupsList();

        return {
            data: groups.map((group) => ({
                code: group,
                name: group,
            })),
        };
    }

    @ApiOperation({
        summary: '키워드 그룹 생성',
        description: '새로운 키워드 그룹을 생성합니다.',
    })
    @ApiBody({
        type: CreateKeywordGroupBody,
    })
    @ApiCreatedResponse()
    @Post()
    public async createKeywordGroup(@Body() { name }: CreateKeywordGroupBody) {
        await this.keywordSettingService.createKeywordGroup(name);
    }

    @ApiOperation({
        summary: '키워드 그룹 삭제',
        description: '키워드 그룹을 삭제합니다.',
    })
    @ApiParam({
        name: 'groupName',
        type: String,
        description: '키워드 그룹 이름',
    })
    @ApiNoContentResponse()
    @Delete(':groupName')
    public async deleteKeywordGroup(@Param('groupName') groupName: string) {
        await this.keywordSettingService.deleteKeywordGroup(groupName);
    }

    @ApiOperation({
        summary: '그룹 내 키워드 목록 조회',
        description: '특정 그룹에 포함된 키워드 목록을 조회합니다.',
    })
    @ApiParam({
        name: 'groupName',
        type: String,
        description: '키워드 그룹 이름',
    })
    @ApiOkResponse({
        type: GetCodesResponse,
    })
    @Get(':groupName')
    public async getKeywordsInGroup(
        @Param('groupName') groupName: string,
    ): Promise<GetCodesResponse> {
        const keywords =
            await this.keywordSettingService.getKeywordsByGroup(groupName);

        return {
            data: keywords.map((keyword) => ({
                code: keyword,
                name: keyword,
            })),
        };
    }

    @ApiOperation({
        summary: '그룹에 키워드 추가',
        description: '키워드 그룹에 새로운 키워드를 추가합니다.',
    })
    @ApiParam({
        name: 'groupName',
        type: String,
        description: '키워드 그룹 이름',
    })
    @ApiBody({
        type: UpsertKeywordBody,
    })
    @ApiCreatedResponse()
    @Post(':groupName/keywords')
    public async addKeywordToGroup(
        @Param('groupName') groupName: string,
        @Body() { keyword }: UpsertKeywordBody,
    ) {
        await this.keywordSettingService.addKeywordToGroup(groupName, keyword);
    }

    @ApiOperation({
        summary: '그룹에 종목(키워드) 추가',
        description:
            '키워드 그룹에 종목을 추가합니다. 종목명이 키워드로 사용됩니다.',
    })
    @ApiParam({
        name: 'groupName',
        type: String,
        description: '키워드 그룹 이름',
    })
    @ApiBody({
        type: UpsertKeywordByStockCodeBody,
    })
    @ApiCreatedResponse()
    @Post(':groupName/stocks')
    public async addStockToGroup(
        @Param('groupName') groupName: string,
        @Body() { stockCode }: UpsertKeywordByStockCodeBody,
    ) {
        assertStockCode(stockCode);
        await this.keywordSettingService.addStockToGroup(groupName, stockCode);
    }

    @ApiOperation({
        summary: '그룹에서 키워드 삭제',
        description: '키워드 그룹에서 특정 키워드를 삭제합니다.',
    })
    @ApiParam({
        name: 'groupName',
        type: String,
        description: '키워드 그룹 이름',
    })
    @ApiParam({
        name: 'keyword',
        type: String,
        description: '삭제할 키워드',
    })
    @ApiNoContentResponse()
    @Delete(':groupName/keywords/:keyword')
    public async deleteKeywordFromGroup(
        @Param('groupName') groupName: string,
        @Param('keyword') keyword: string,
    ) {
        await this.keywordSettingService.deleteKeywordFromGroup(
            groupName,
            keyword,
        );
    }
}
