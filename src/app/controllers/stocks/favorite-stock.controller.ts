import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBody,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
} from '@nestjs/swagger';
import { assertStockCode, getStockName } from '@common/domains';
import { ExistingStockGuard } from '@app/common/guards';
import {
    FavoriteStockService,
    FavoriteType,
} from '@app/modules/repositories/favorite-stock';
import { GetFavoritesResponse, UpsertFavoriteStockBody } from './dto';

@Controller('v1/favorite-stocks')
export class FavoriteStockController {
    private logger = new Logger(FavoriteStockController.name);

    constructor(private readonly favoriteStockService: FavoriteStockService) {}

    @ApiOperation({
        summary: '관심있는 종목 추가',
        description: '관심있는 종목 코드를 추가합니다.',
    })
    @ApiBody({
        type: UpsertFavoriteStockBody,
    })
    @ApiNoContentResponse()
    @Post()
    public async addFavoriteStockCode(
        @Body() { stockCode }: UpsertFavoriteStockBody,
    ) {
        assertStockCode(stockCode);

        await this.favoriteStockService.upsert({
            type: FavoriteType.Manual,
            stockCode,
            stockName: getStockName(stockCode),
        });
    }

    @ApiOperation({
        summary: '관심있는 종목 제거',
        description: '관심있는 종목 코드를 제거합니다.',
    })
    @ApiParam({
        name: 'stockCode',
        type: String,
        description: '종목 코드',
    })
    @ApiNoContentResponse()
    @UseGuards(ExistingStockGuard)
    @Delete(':stockCode')
    public async deleteFavoriteStockCode(
        @Param('stockCode') stockCode: string,
    ) {
        try {
            assertStockCode(stockCode);

            await this.favoriteStockService.deleteByStockCode({
                type: FavoriteType.Manual,
                stockCode,
            });
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @ApiOperation({
        summary: '관심있는 종목 목록 조회',
        description: '관심있는 종목 코드들을 조회합니다.',
    })
    @ApiOkResponse({
        type: GetFavoritesResponse,
    })
    @Get()
    public async getFavoriteStockCodes(): Promise<GetFavoritesResponse> {
        const favoriteStocks = await this.favoriteStockService.findByType(
            FavoriteType.Manual,
        );

        return {
            data: favoriteStocks,
        };
    }
}
