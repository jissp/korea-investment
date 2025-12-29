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
    ApiBody,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
} from '@nestjs/swagger';
import { assertStockCode, getStockName } from '@common/domains';
import { GetCodesResponse } from '@app/common';
import {
    KoreaInvestmentSettingEvent,
    KoreaInvestmentSettingService,
} from '@app/modules/korea-investment-setting';
import { UpsertFavoriteStockBody } from './dto';

@Controller('v1/favorite-stocks')
export class FavoriteStockController {
    private logger = new Logger(FavoriteStockController.name);

    constructor(
        private readonly settingService: KoreaInvestmentSettingService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

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
        try {
            assertStockCode(stockCode);

            await this.settingService.addStockCode(stockCode);
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
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
        try {
            assertStockCode(stockCode);

            await this.settingService.deleteStockCode(stockCode);

            this.eventEmitter.emit(
                KoreaInvestmentSettingEvent.DeletedStockCode,
                {
                    stockCode,
                },
            );
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
        type: GetCodesResponse,
    })
    @Get()
    public async getFavoriteStockCodes(): Promise<GetCodesResponse> {
        try {
            const codes = await this.settingService.getStockCodes();

            return {
                data: codes.map((code) => ({
                    code,
                    name: getStockName(code),
                })),
            };
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }
}
