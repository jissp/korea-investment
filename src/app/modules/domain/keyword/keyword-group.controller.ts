import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
    ApiBody,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
} from '@nestjs/swagger';
import { GetCodesResponse } from '@app/common/dto';
import { CreateKeywordGroupBody } from './dto';
import {
    CreateKeywordGroupUseCase,
    DeleteKeywordGroupUseCase,
    GetKeywordGroupsUseCase,
} from './use-cases';

@Controller('v1/keyword-groups')
export class KeywordGroupController {
    constructor(
        private readonly createKeywordGroupUseCase: CreateKeywordGroupUseCase,
        private readonly deleteKeywordGroupUseCase: DeleteKeywordGroupUseCase,
        private readonly getKeywordGroupsUseCase: GetKeywordGroupsUseCase,
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
        const data = await this.getKeywordGroupsUseCase.execute();

        return {
            data,
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
        await this.createKeywordGroupUseCase.execute({
            name,
        });
    }

    @ApiOperation({
        summary: '키워드 그룹 삭제',
        description: '키워드 그룹을 삭제합니다.',
    })
    @ApiParam({
        name: 'groupId',
        type: Number,
        description: '키워드 그룹 ID',
    })
    @ApiNoContentResponse()
    @Delete(':groupId')
    public async deleteKeywordGroup(@Param('groupId') groupId: number) {
        await this.deleteKeywordGroupUseCase.execute(groupId);
    }
}
