import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { NewsService } from '@app/modules/services/news-service';
import {
    AllNewsByKeywordGroupResponse,
    NewsByKeywordGroupResponse,
    NewsByKeywordResponse,
    NewsByStockResponse,
    NewsResponse,
} from './dto';

@Controller('v1/news')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}

    @ApiOperation({
        summary: '뉴스 조회',
    })
    @ApiOkResponse({
        type: NewsResponse,
    })
    @Get()
    public async getNews(): Promise<NewsResponse> {
        const newsList = await this.newsService.getAllNews({
            limit: 100,
        });

        return {
            data: newsList,
        };
    }

    @ApiOperation({
        summary: '키워드별 뉴스 조회',
    })
    @ApiOkResponse({
        type: NewsByKeywordResponse,
    })
    @Get('by-keyword')
    public async getNewsByKeyword(): Promise<NewsByKeywordResponse> {
        const newsByKeyword = await this.newsService.getAllKeywordNews();

        return {
            data: newsByKeyword,
        };
    }

    @ApiOperation({
        summary: '전체 키워드 그룹별 뉴스 조회',
    })
    @ApiOkResponse({
        type: AllNewsByKeywordGroupResponse,
    })
    @Get('by-keyword-group')
    public async getAllNewsByKeywordGroup(): Promise<AllNewsByKeywordGroupResponse> {
        const result = await this.newsService.getAllKeywordGroupNews();

        return {
            data: result,
        };
    }

    @ApiOperation({
        summary: '키워드 그룹별 뉴스 조회',
    })
    @ApiOkResponse({
        type: NewsByKeywordGroupResponse,
    })
    @ApiParam({
        name: 'groupName',
        type: String,
        description: '키워드 그룹명',
    })
    @Get('by-keyword-group/:groupName')
    public async getNewsByKeywordGroup(
        @Param('groupName') groupName: string,
    ): Promise<NewsByKeywordGroupResponse> {
        const result = await this.newsService.getKeywordGroupNews(groupName);

        return {
            data: result,
        };
    }

    @ApiOperation({
        summary: '종목별 뉴스 조회',
    })
    @ApiOkResponse({
        type: NewsByStockResponse,
    })
    @Get('by-stock')
    public async getNewsByStock(): Promise<NewsByStockResponse> {
        const newsByStock = await this.newsService.getAllTypeNews();

        return {
            data: newsByStock,
        };
    }
}
