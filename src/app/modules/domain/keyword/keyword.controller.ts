import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
    ApiBody,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
} from '@nestjs/swagger';
import {
    CreateKeywordBody,
    DeleteKeywordBody,
    GetKeywordsResponse,
} from './dto';
import {
    CreateKeywordUseCase,
    DeleteKeywordUseCase,
    GetKeywordsByGroupUseCase,
} from './use-cases';

@Controller('v1/keywords')
export class KeywordController {
    constructor(
        private readonly createKeywordUseCase: CreateKeywordUseCase,
        private readonly deleteKeywordUseCase: DeleteKeywordUseCase,
        private readonly getKeywordsByGroupUseCase: GetKeywordsByGroupUseCase,
    ) {}

    @ApiOperation({
        summary: '키워드 추가',
        description: '키워드를 추가합니다.',
    })
    @ApiBody({
        type: CreateKeywordBody,
    })
    @ApiCreatedResponse()
    @Post()
    public async createKeyword(
        @Body() { keyword, keywordGroupId }: CreateKeywordBody,
    ) {
        await this.createKeywordUseCase.execute({
            keyword,
            keywordGroupId,
        });
    }

    @ApiOperation({
        summary: '키워드 삭제',
        description: '키워드를 삭제합니다.',
    })
    @ApiBody({
        type: DeleteKeywordBody,
    })
    @ApiNoContentResponse()
    @Delete(':keyword')
    public async deleteKeyword(
        @Param('keyword') keyword: string,
        @Body() { keywordGroupId }: DeleteKeywordBody,
    ) {
        await this.deleteKeywordUseCase.execute({
            keyword,
            keywordGroupId,
        });
    }

    @ApiOperation({
        summary: '그룹 내 키워드 목록 조회',
        description: '특정 그룹에 포함된 키워드 목록을 조회합니다.',
    })
    @ApiParam({
        name: 'groupId',
        type: Number,
        description: '키워드 그룹 ID',
    })
    @ApiOkResponse({
        type: GetKeywordsResponse,
    })
    @Get('by-group/:groupId')
    public async getKeywordsByGroup(
        @Param('groupId') groupId: number,
    ): Promise<GetKeywordsResponse> {
        const data = await this.getKeywordsByGroupUseCase.execute(groupId);

        return {
            data,
        };
    }
}
