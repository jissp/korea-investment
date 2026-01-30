import { Controller, Delete, Get, Logger, Param, Post } from '@nestjs/common';
import {
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
} from '@nestjs/swagger';
import { ThemeService } from '@app/modules/repositories/theme';
import { GetThemesResponse, GetThemeStocksResponse } from './dto';

@Controller('v1/themes')
export class ThemeController {
    private logger = new Logger(ThemeController.name);

    constructor(private readonly themeService: ThemeService) {}

    @ApiOperation({
        summary: '테마 목록 조회',
        description: '테마 목록을 조회합니다.',
    })
    @ApiOkResponse({
        type: GetThemesResponse,
    })
    @Get()
    public async getThemes(): Promise<GetThemesResponse> {
        const themes = await this.themeService.getThemes();

        return {
            data: themes,
        };
    }

    @ApiOperation({
        summary: '즐겨찾기 테마 목록 조회',
        description: '즐겨찾기한 테마 목록을 조회합니다.',
    })
    @ApiOkResponse({
        type: GetThemesResponse,
    })
    @Get('favorites')
    public async getFavoriteThemes(): Promise<GetThemesResponse> {
        const themes = await this.themeService.getFavoriteThemes();

        return {
            data: themes,
        };
    }

    @ApiOperation({
        summary: '종목이 포함된 테마 목록 조회',
        description: '종목이 포함된 테마 목록을 조회합니다.',
    })
    @ApiParam({
        name: 'stockCode',
        description: '종목 코드',
        type: String,
        required: true,
    })
    @ApiOkResponse({
        type: GetThemesResponse,
    })
    @Get('by-stock/:stockCode')
    public async getThemesByStockCode(
        @Param('stockCode') stockCode: string,
    ): Promise<GetThemesResponse> {
        const themes = await this.themeService.getThemesByStockCode(stockCode);

        return {
            data: themes,
        };
    }

    @ApiOperation({
        summary: '테마에 속한 종목 목록 조회',
        description: '특정 테마에 속한 종목들을 조회합니다.',
    })
    @ApiParam({
        name: 'themeCode',
        description: '테마 코드',
        type: String,
        required: true,
    })
    @ApiOkResponse({
        type: GetThemeStocksResponse,
    })
    @Get('stocks/:themeCode')
    public async getThemeStocksByTheme(
        @Param('themeCode') themeCode: string,
    ): Promise<GetThemeStocksResponse> {
        const themes =
            await this.themeService.getThemeStocksByThemeCode(themeCode);

        return {
            data: themes,
        };
    }

    @ApiOperation({
        summary: '테마 즐겨찾기 추가',
        description: '테마를 즐겨찾기에 추가합니다.',
    })
    @ApiParam({
        name: 'themeCode',
        description: '테마 코드',
        type: String,
        required: true,
    })
    @ApiNoContentResponse()
    @Post(':themeCode/favorite')
    public async addThemeFavorite(
        @Param('themeCode') themeCode: string,
    ): Promise<void> {
        await this.themeService.updateThemeFavorite(themeCode, true);
    }

    @ApiOperation({
        summary: '테마 즐겨찾기 제거',
        description: '테마를 즐겨찾기에서 제거합니다.',
    })
    @ApiParam({
        name: 'themeCode',
        description: '테마 코드',
        type: String,
        required: true,
    })
    @ApiNoContentResponse()
    @Delete(':themeCode/favorite')
    public async removeThemeFavorite(
        @Param('themeCode') themeCode: string,
    ): Promise<void> {
        await this.themeService.updateThemeFavorite(themeCode, false);
    }
}
