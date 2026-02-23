import {
    Body,
    Controller,
    Delete,
    Get,
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
import { assertStockCode } from '@common/domains';
import { ExistingStockGuard } from '@app/common/guards';
import { GetFavoritesResponse, UpsertFavoriteStockRequest } from './dto';
import {
    AddFavoriteStockUseCase,
    GetFavoriteStocksUseCase,
    RemoveFavoriteStockUseCase,
} from './use-cases';

@Controller('v1/favorite-stocks')
export class FavoriteStockController {
    constructor(
        private readonly addFavoriteStockUseCase: AddFavoriteStockUseCase,
        private readonly removeFavoriteStockUseCase: RemoveFavoriteStockUseCase,
        private readonly getFavoriteStocksUseCase: GetFavoriteStocksUseCase,
    ) {}

    @ApiOperation({
        summary: '관심있는 종목 추가',
        description: '관심있는 종목 코드를 추가합니다.',
    })
    @ApiBody({
        type: UpsertFavoriteStockRequest,
    })
    @ApiNoContentResponse()
    @Post()
    public async addFavoriteStock(
        @Body() { stockCode }: UpsertFavoriteStockRequest,
    ) {
        assertStockCode(stockCode);
        await this.addFavoriteStockUseCase.execute({ stockCode });
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
    public async removeFavoriteStock(@Param('stockCode') stockCode: string) {
        assertStockCode(stockCode);
        await this.removeFavoriteStockUseCase.execute({ stockCode });
    }

    @ApiOperation({
        summary: '관심있는 종목 목록 조회',
        description: '관심있는 종목 코드들을 조회합니다.',
    })
    @ApiOkResponse({
        type: GetFavoritesResponse,
    })
    @Get()
    public async getFavoriteStocks(): Promise<GetFavoritesResponse> {
        const data = await this.getFavoriteStocksUseCase.execute();
        return { data };
    }
}
