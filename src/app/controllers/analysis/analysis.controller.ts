import {
    Controller,
    Get,
    InternalServerErrorException,
    Param,
    Post,
} from '@nestjs/common';
import {
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { assertStockCode } from '@common/domains';
import { StockAnalyzerService } from '@app/modules/stock-analyzer';
import { AnalysisRepository } from '@app/modules/repositories/analysis-repository';
import {
    GetAiAnalysisKeywordGroupResponse,
    GetAiAnalysisKeywordGroupsResponse,
    GetAiAnalysisStockResponse,
    GetAiAnalysisStocksResponse,
} from './dto';

@ApiTags('Analysis')
@Controller('v1/analysis')
export class AnalysisController {
    constructor(
        private readonly analysisRepository: AnalysisRepository,
        private readonly stockAnalyzerService: StockAnalyzerService,
    ) {}

    @ApiOperation({
        summary: '종목 AI 분석 요청',
        description:
            'Gemini를 통해 주식 뉴스 기반 분석을 비동기로 요청합니다. 결과는 이벤트로 처리됩니다.',
    })
    @ApiParam({
        name: 'stockCode',
        type: String,
        description: '종목 코드(005930)',
        example: '005930',
    })
    @ApiNoContentResponse()
    @Post('stocks/:stockCode/ai')
    public async requestAIAnalysisStock(@Param('stockCode') stockCode: string) {
        assertStockCode(stockCode);

        try {
            await this.stockAnalyzerService.requestAnalyzeStock(stockCode);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @ApiOperation({
        summary: '종목 AI 분석 조회',
        description: 'Gemini를 통해 분석된 주식 정보를 조회합니다.',
    })
    @ApiParam({
        name: 'stockCode',
        type: String,
        description: '종목 코드(005930)',
        example: '005930',
    })
    @ApiOkResponse({
        type: GetAiAnalysisStockResponse,
    })
    @Get('stocks/:stockCode/ai')
    public async getAIAnalysisStock(
        @Param('stockCode') stockCode: string,
    ): Promise<GetAiAnalysisStockResponse> {
        assertStockCode(stockCode);

        return {
            data: await this.analysisRepository.getAIAnalysisStock(stockCode),
        };
    }

    @ApiOperation({
        summary: '종목 AI 분석 조회',
        description: 'Gemini를 통해 분석된 주식 정보들을 조회합니다.',
    })
    @ApiOkResponse({
        type: GetAiAnalysisStocksResponse,
    })
    @Get('stocks/ai')
    public async getAIAnalysisStocks(): Promise<GetAiAnalysisStocksResponse> {
        return {
            data: await this.analysisRepository.getAIAnalysisStocks(),
        };
    }

    @ApiOperation({
        summary: '키워드 그룹 AI 분석 요청',
        description:
            'Gemini를 통해 주식 뉴스 기반 분석을 비동기로 요청합니다. 결과는 이벤트로 처리됩니다.',
    })
    @ApiParam({
        name: 'groupName',
        type: String,
        description: '키워드 그룹명',
        example: '2차전지',
    })
    @ApiNoContentResponse()
    @Post('keyword-groups/:groupName/ai')
    public async requestAIAnalysisKeywordGroup(
        @Param('groupName') groupName: string,
    ) {
        try {
            await this.stockAnalyzerService.requestAnalyzeKeywordGroup(
                groupName,
            );
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @ApiOperation({
        summary: '키워드 그룹 AI 분석 조회',
        description: 'Gemini를 통해 분석된 키워드 그룹 정보를 조회합니다.',
    })
    @ApiParam({
        name: 'groupName',
        type: String,
        description: '키워드 그룹명',
        example: '2차전지',
    })
    @ApiOkResponse({
        type: GetAiAnalysisKeywordGroupResponse,
    })
    @Get('keyword-groups/:groupName/ai')
    public async getAIAnalysisKeywordGroup(
        @Param('groupName') groupName: string,
    ): Promise<GetAiAnalysisKeywordGroupResponse> {
        return {
            data: await this.analysisRepository.getAIAnalysisKeywordGroup(
                groupName,
            ),
        };
    }

    @ApiOperation({
        summary: '키워드 그룹 AI 분석 조회',
        description: 'Gemini를 통해 분석된 키워드 그룹 정보들을 조회합니다.',
    })
    @ApiOkResponse({
        type: GetAiAnalysisKeywordGroupsResponse,
    })
    @Get('keyword-groups/ai')
    public async getAIAnalysisKeywordGroups(): Promise<GetAiAnalysisKeywordGroupsResponse> {
        return {
            data: await this.analysisRepository.getAIAnalysisKeywordGroups(),
        };
    }
}
