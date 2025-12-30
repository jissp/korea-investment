import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { getStockName } from '@common/domains';
import {
    KeywordType,
    KoreaInvestmentKeywordSettingService,
    KoreaInvestmentSettingService,
} from '@app/modules/korea-investment-setting';
import { NewsService } from '@app/modules/news';
import {
    NewsByKeywordResponse,
    NewsByStockResponse,
    NewsResponse,
} from './dto';

@Controller('v1/news')
export class NewsController {
    constructor(
        private readonly settingService: KoreaInvestmentSettingService,
        private readonly keywordSettingService: KoreaInvestmentKeywordSettingService,
        private readonly newsService: NewsService,
    ) {}

    @ApiOperation({
        summary: '뉴스 조회',
    })
    @ApiOkResponse({
        type: NewsResponse,
    })
    @Get()
    public async getNews(): Promise<NewsResponse> {
        const newsList = await this.newsService.getNewsList();

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
        const keywords = await this.keywordSettingService.getKeywordsByType(
            KeywordType.Manual,
        );

        const results = await Promise.allSettled(
            keywords.map(async (keyword) => {
                return {
                    keyword,
                    news: await this.newsService.getKeywordNewsList(keyword),
                };
            }),
        );

        const newsByKeyword = results
            .filter((result) => result.status === 'fulfilled')
            .map((result) => result.value);

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
        const stockCodes = await this.settingService.getStockCodes();

        const results = await Promise.allSettled(
            stockCodes.map(async (stockCode) => {
                return {
                    stockCode: stockCode,
                    stockName: getStockName(stockCode),
                    news: await this.newsService.getStockNewsList(stockCode),
                };
            }),
        );

        const newsByStock = results
            .filter((result) => result.status === 'fulfilled')
            .map((result) => result.value);

        return {
            data: newsByStock,
        };
    }
}
