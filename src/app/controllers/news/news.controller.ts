import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { KoreaInvestmentSettingService } from '@app/modules/korea-investment-setting';
import { NewsService } from '@app/modules/news';
import {
    NewsByKeywordResponse,
    NewsByStockResponse,
    NewsResponse,
} from './dto';
import { getStockName } from '@common/domains';

@Controller('v1/news')
export class NewsController {
    constructor(
        private readonly koreaInvestmentSettingService: KoreaInvestmentSettingService,
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
        const newsIds = await this.newsService.getNewsIds();
        const news = await this.newsService.populateNews(newsIds);

        return {
            data: news,
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
        const keywords = await this.koreaInvestmentSettingService.getKeywords();

        const results = await Promise.allSettled(
            keywords.map(async (keyword) => {
                const newsIds =
                    await this.newsService.getKeywordNewsScore(keyword);

                return {
                    keyword,
                    news: await this.newsService.populateNews(newsIds),
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
        const stockCodes =
            await this.koreaInvestmentSettingService.getStockCodes();

        const results = await Promise.allSettled(
            stockCodes.map(async (stockCode) => {
                const newsIds =
                    await this.newsService.getStockNewsScore(stockCode);

                return {
                    stockCode: stockCode,
                    stockName: getStockName(stockCode),
                    news: await this.newsService.populateNews(newsIds),
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
