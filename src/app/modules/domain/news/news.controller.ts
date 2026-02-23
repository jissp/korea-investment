import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { NewsCategory } from '@app/modules/repositories/news-repository';
import { NewsResponse } from './dto/responses/news.response';
import { GetNewsByCategoryUseCase, GetNewsUseCase } from './use-cases';

@Controller('v1/news')
export class NewsController {
    constructor(
        private readonly getNewsUseCase: GetNewsUseCase,
        private readonly getNewsByCategoryUseCase: GetNewsByCategoryUseCase,
    ) {}

    @ApiOperation({
        summary: '뉴스 조회',
    })
    @ApiOkResponse({
        type: NewsResponse,
    })
    @Get()
    public async getNews(): Promise<NewsResponse> {
        return this.getNewsUseCase.execute();
    }

    @ApiOperation({
        summary: '카테고리별 뉴스 조회',
    })
    @ApiOkResponse({
        type: NewsResponse,
    })
    @ApiParam({
        name: 'category',
        type: String,
        enum: NewsCategory,
        description: '뉴스 카테고리',
    })
    @Get('by-category/:category')
    public async getNewsByCategory(
        @Param('category') category: NewsCategory,
    ): Promise<NewsResponse> {
        return this.getNewsByCategoryUseCase.execute({
            category,
        });
    }
}
