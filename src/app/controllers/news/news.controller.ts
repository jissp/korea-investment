import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { NewsService } from '@app/modules/services/news-service';
import {
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
