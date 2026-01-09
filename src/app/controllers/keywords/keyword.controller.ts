import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
} from '@nestjs/common';
import {
    ApiBody,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
} from '@nestjs/swagger';
import {
    KeywordGroupService,
    KeywordService,
    KeywordType,
} from '@app/modules/repositories/keyword';
import {
    CreateKeywordBody,
    DeleteKeywordBody,
    GetKeywordsResponse,
} from './dto';

@Controller('v1/keywords')
export class KeywordController {
    constructor(
        private readonly keywordService: KeywordService,
        private readonly keywordGroupService: KeywordGroupService,
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
        await this.keywordService.createKeyword({
            type: KeywordType.Manual,
            name: keyword,
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
        if (keywordGroupId) {
            const keywordGroup =
                await this.keywordGroupService.getKeywordGroup(keywordGroupId);
            if (!keywordGroup) {
                throw new NotFoundException('키워드 그룹이 존재하지 않습니다.');
            }
        }

        await this.keywordService.deleteKeywordByName({
            type: KeywordType.Manual,
            name: keyword,
            keywordGroupId: keywordGroupId ?? null,
        });
    }

    @ApiOperation({
        summary: '그룹 내 키워드 목록 조회',
        description: '특정 그룹에 포함된 키워드 목록을 조회합니다.',
    })
    @ApiParam({
        name: 'groupId',
        type: Number,
        description: '키워드 그룹 이름',
    })
    @ApiOkResponse({
        type: GetKeywordsResponse,
    })
    @Get('by-group/:groupId')
    public async getKeywordsByGroup(
        @Param('groupId') groupId: number,
    ): Promise<GetKeywordsResponse> {
        const keywords =
            await this.keywordService.getKeywordsByGroupId(groupId);

        return {
            data: keywords,
        };
    }
}
