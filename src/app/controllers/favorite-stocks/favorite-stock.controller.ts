import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
} from '@nestjs/swagger';
import { GetCodesResponse } from '@app/common';
import { existsStockCode, getStockName } from '@common/domains';
import {
    KoreaInvestmentSettingEvent,
    KoreaInvestmentSettingService,
} from '@app/modules/korea-investment-setting';
import { UpsertFavoriteStockBody } from './dto';

@Controller('v1/favorite-stocks')
export class FavoriteStockController {
    private logger = new Logger(FavoriteStockController.name);

    constructor(
        private readonly koreaInvestmentSettingService: KoreaInvestmentSettingService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    @ApiOperation({
        summary: '관심있는 종목 추가',
        description: '관심있는 종목 코드를 추가합니다.',
    })
    @ApiNoContentResponse()
    @Post()
    public async registerFavoriteStockCode(
        @Body() { stockCode }: UpsertFavoriteStockBody,
    ) {
        if (!existsStockCode(stockCode)) {
            throw new Error('존재하지 않는 종목 코드입니다.');
        }

        await this.koreaInvestmentSettingService.addStockCode(stockCode);
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
    @Delete(':stockCode')
    public async deleteFavoriteStockCode(
        @Param('stockCode') stockCode: string,
    ) {
        await this.koreaInvestmentSettingService.deleteStockCode(stockCode);

        this.eventEmitter.emit(KoreaInvestmentSettingEvent.DeletedStockCode, {
            stockCode,
        });
    }

    @ApiOperation({
        summary: '관심있는 종목 목록 조회',
        description: '관심있는 종목 코드들을 조회합니다.',
    })
    @ApiOkResponse({
        type: GetCodesResponse,
    })
    @Get()
    public async getFavoriteStockCodes(): Promise<GetCodesResponse> {
        const codes = await this.koreaInvestmentSettingService.getStockCodes();

        return {
            data: codes.map((code) => ({
                code,
                name: getStockName(code),
            })),
        };
    }
}
