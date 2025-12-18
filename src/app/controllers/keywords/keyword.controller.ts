import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post,
} from '@nestjs/common';
import {
    ApiBody,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
} from '@nestjs/swagger';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getStockName } from '@common/domains';
import { GetCodesResponse } from '@app/common';
import {
    KoreaInvestmentSettingEvent,
    KoreaInvestmentSettingService,
} from '@app/modules/korea-investment-setting';
import { UpsertKeywordBody, UpsertKeywordByStockCodeBody } from './dto';

@Controller('v1/keywords')
export class KeywordController {
    private readonly logger = new Logger('KeywordController');

    constructor(
        private readonly koreaInvestmentSettingService: KoreaInvestmentSettingService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    @ApiOperation({
        summary: '관심있는 키워드 목록 조회',
        description: '관심있는 키워드 목록을 조회합니다.',
    })
    @ApiOkResponse({
        type: GetCodesResponse,
    })
    @Get()
    public async getKeywords(): Promise<GetCodesResponse> {
        const keywords = await this.koreaInvestmentSettingService.getKeywords();

        return {
            data: keywords.map((keyword) => ({
                code: keyword,
                name: keyword,
            })),
        };
    }

    @ApiOperation({
        summary: '관심있는 키워드 추가',
        description: '관심있는 키워드를 추가합니다.',
    })
    @ApiBody({
        type: UpsertKeywordBody,
    })
    @ApiCreatedResponse()
    @Post()
    public async registerKeyword(@Body() { keyword }: UpsertKeywordBody) {
        await this.koreaInvestmentSettingService.addKeyword(keyword);
    }

    @ApiOperation({
        summary: '관심있는 키워드 제거',
        description: '관심있는 키워드를 제거합니다.',
    })
    @ApiParam({
        name: 'keyword',
        type: String,
        description: '키워드',
    })
    @ApiCreatedResponse()
    @Delete(':keyword')
    public async deleteKeyword(@Param('keyword') keyword: string) {
        await this.koreaInvestmentSettingService.deleteKeyword(keyword);

        this.eventEmitter.emit(KoreaInvestmentSettingEvent.DeletedKeyword, {
            keyword,
        });
    }

    @ApiOperation({
        summary: '종목별 키워드 목록 조회',
        description: '종목별로 사용중인 키워드 목록을 조회합니다.',
    })
    @ApiParam({
        name: 'stockCode',
        type: String,
        description: '종목 코드',
    })
    @ApiOkResponse({
        type: GetCodesResponse,
    })
    @Get('by-stock/:stockCode')
    public async getKeywordsByStock(
        @Param('stockCode') stockCode: string,
    ): Promise<GetCodesResponse> {
        const keywords =
            await this.koreaInvestmentSettingService.getKeywordsByStockCode(
                stockCode,
            );

        return {
            data: keywords.map((keyword) => ({
                code: keyword,
                name: keyword,
            })),
        };
    }

    @ApiOperation({
        summary: '키워드에 등록된 종목 목록 조회',
        description: '키워드에 등록된 종목 목록을 조회합니다.',
    })
    @ApiParam({
        name: 'keyword',
        type: String,
        description: '키워드',
    })
    @ApiOkResponse({
        type: GetCodesResponse,
    })
    @Get(':keyword/stocks')
    public async getStockKeywords(
        @Param('keyword') keyword: string,
    ): Promise<GetCodesResponse> {
        const stockCodes =
            await this.koreaInvestmentSettingService.getStockCodesFromKeyword(
                keyword,
            );

        return {
            data: stockCodes.map((stockCode) => ({
                code: stockCode,
                name: getStockName(stockCode),
            })),
        };
    }

    @ApiOperation({
        summary: '키워드에 종목 추가',
        description:
            '키워드에 종목을 추가합니다. 키워드에 등록된 종목는 주기적으로 뉴스 정보 등을 수집하는데 사용됩니다.',
    })
    @ApiParam({
        name: 'keyword',
        type: String,
        description: '키워드',
    })
    @ApiBody({
        type: UpsertKeywordByStockCodeBody,
    })
    @ApiCreatedResponse()
    @Post(':keyword/stocks')
    public async registerStockKeyword(
        @Param('keyword') keyword: string,
        @Body() { stockCode }: UpsertKeywordByStockCodeBody,
    ) {
        try {
            await Promise.all([
                this.koreaInvestmentSettingService.addKeyword(keyword),
                this.koreaInvestmentSettingService.addKeywordToStock(
                    stockCode,
                    keyword,
                ),
                this.koreaInvestmentSettingService.addStockCodeToKeyword(
                    keyword,
                    stockCode,
                ),
            ]);
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @ApiOperation({
        summary: '키워드에 등록된 종목 제거',
        description: '키워드에 등록된 종목를 제거합니다.',
    })
    @ApiParam({
        name: 'keyword',
        type: String,
        description: '키워드에 등록된 종목',
    })
    @ApiParam({
        name: 'stockCode',
        type: String,
        description: '종목 코드',
    })
    @ApiNoContentResponse()
    @Delete(':keyword/stocks/:stockCode')
    public async deleteStockKeyword(
        @Param('stockCode') stockCode: string,
        @Param('keyword') keyword: string,
    ) {
        await this.koreaInvestmentSettingService.deleteStockCodeFromKeyword(
            keyword,
            stockCode,
        );
    }
}
