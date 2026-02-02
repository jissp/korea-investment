import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { NewsService } from '@app/modules/app-services/news-service';
import {
    NewsByKeywordGroupResponse,
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
        summary: '키워드 그룹별 뉴스 조회',
    })
    @ApiOkResponse({
        type: NewsByKeywordGroupResponse,
    })
    @ApiParam({
        name: 'keywordGroupName',
        type: String,
        description: '키워드 그룹명',
    })
    @Get('by-keyword-group/:keywordGroupName')
    public async getNewsByKeywordGroup(
        @Param('keywordGroupName') keywordGroupName: string,
    ): Promise<NewsByKeywordGroupResponse> {
        const news = await this.newsService.getKeywordGroupNews({
            keywordGroupName,
        });

        return {
            data: {
                keywordGroupName,
                news,
            },
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
