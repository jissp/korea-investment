import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { getStockName } from '@common/domains';
import { NaverNewsService } from '@app/modules/naver-news';
import { StockRepository } from '@app/modules/stock-repository';
import {
    InformationKoreaInvestmentNewsResponse,
    InformationNaverNewsByKeywordResponse,
    InformationNaverNewsByStockCodeResponse,
    InformationNaverNewsByStockCodeWithKeyword,
    InformationNaverNewsResponse,
    InformationStockPlusNewsResponse,
} from './dto';
import { KoreaInvestmentSettingService } from '@app/modules/korea-investment-setting/korea-investment-setting.service';

@Controller('v1/information')
export class InformationController {
    constructor(
        private readonly stockRepository: StockRepository,
        private readonly naverNewsService: NaverNewsService,
        private readonly koreaInvestmentSettingService: KoreaInvestmentSettingService,
    ) {}

    @ApiOperation({
        summary: '한국투자증권 뉴스 조회',
    })
    @ApiOkResponse({
        type: InformationKoreaInvestmentNewsResponse,
    })
    @Get('news/korea-investment')
    public async getKoreaInvestmentNews(): Promise<InformationKoreaInvestmentNewsResponse> {
        const news = await this.stockRepository.getKoreaInvestmentNews();

        return {
            data: news,
        };
    }

    @ApiOperation({
        summary: '증권 플러스 뉴스 조회',
    })
    @ApiOkResponse({
        type: InformationStockPlusNewsResponse,
    })
    @Get('news/stock-plus')
    public async getStockPlusNews(): Promise<InformationStockPlusNewsResponse> {
        const news = await this.stockRepository.getStockPlusNews();

        return {
            data: news,
        };
    }

    @ApiOperation({
        summary: '네이버 뉴스 조회 (등록된 키워드 대상)',
    })
    @ApiOkResponse({
        type: InformationNaverNewsResponse,
    })
    @Get('news/naver')
    public async getNaverNews(): Promise<InformationNaverNewsResponse> {
        const newsIds = await this.naverNewsService.getNewsIds();
        const news = await this.naverNewsService.populateNews(newsIds);

        return {
            data: news,
        };
    }

    @ApiOperation({
        summary: '종목 키워드별 뉴스 조회',
    })
    @ApiOkResponse({
        type: InformationNaverNewsByKeywordResponse,
    })
    @Get('news/by-keyword')
    public async getNaverNewsByKeyword(): Promise<InformationNaverNewsByKeywordResponse> {
        const keywords = await this.koreaInvestmentSettingService.getKeywords();

        // 키워드가 없을 경우 빈 배열 응답
        if (!keywords.length) {
            return {
                data: [],
            };
        }

        const results = await Promise.allSettled(
            keywords.map(async (keyword) => {
                const newsIds =
                    await this.naverNewsService.getNaverNewsIdsByKeyword(
                        keyword,
                    );

                return {
                    keyword,
                    news: await this.naverNewsService.populateNews(newsIds),
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
        type: InformationNaverNewsByStockCodeResponse,
    })
    @Get('news/by-stock-code')
    public async getNaverNewsByStockCode(): Promise<InformationNaverNewsByStockCodeResponse> {
        const stockCodes =
            await this.koreaInvestmentSettingService.getStockCodes();

        // 종목 코드가 없을 경우 빈 배열 응답
        if (!stockCodes.length) {
            return {
                data: [],
            };
        }

        const results = await Promise.allSettled(
            stockCodes.map(
                async (
                    stockCode,
                ): Promise<InformationNaverNewsByStockCodeWithKeyword> => {
                    const newsIds =
                        await this.naverNewsService.getStockNewsIdsByStockCode(
                            stockCode,
                        );
                    const news =
                        await this.naverNewsService.populateNews(newsIds);

                    return {
                        stockCode,
                        name: getStockName(stockCode),
                        news,
                    };
                },
            ),
        );

        const newsByKey = results
            .filter((result) => result.status === 'fulfilled')
            .map((result) => result.value);

        return { data: newsByKey };
    }
}
