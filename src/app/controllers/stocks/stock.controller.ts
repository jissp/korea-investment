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
} from '@nestjs/swagger';
import { assertStockCode } from '@common/domains';
import { KoreaInvestmentCollectorSocket } from '@app/modules/korea-investment-collector';
import { StockAnalyzerService } from '@app/modules/stock-analyzer';
import { AnalysisRepository } from '@app/modules/repositories/analysis-repository';
import { GetAiAnalysisStockResponse, GetAiAnalysisStocksResponse } from './dto';

@Controller('v1/stocks')
export class StockController {
    constructor(
        private readonly koreaInvestmentCollectorSocket: KoreaInvestmentCollectorSocket,
        private readonly analysisRepository: AnalysisRepository,
        private readonly stockAnalyzerService: StockAnalyzerService,
    ) {}

    @ApiOperation({
        summary: '종목 구독',
    })
    @ApiParam({
        name: 'stockCode',
        type: String,
        description: '종목 코드',
    })
    @ApiNoContentResponse()
    @Post(':stockCode/subscribe')
    public async subscribe(@Param('stockCode') stockCode: string) {
        assertStockCode(stockCode);

        await this.koreaInvestmentCollectorSocket.subscribe(stockCode);
    }

    @ApiOperation({
        summary: '종목 구독 해제',
    })
    @ApiParam({
        name: 'stockCode',
        type: String,
        description: '종목 코드',
    })
    @ApiNoContentResponse()
    @Post(':stockCode/unsubscribe')
    public async unsubscribe(@Param('stockCode') stockCode: string) {
        assertStockCode(stockCode);

        await this.koreaInvestmentCollectorSocket.unsubscribe(stockCode);
    }

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
    @Post(':stockCode/analysis/ai')
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
    @Get(':stockCode/analysis/ai')
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
    @Get('analysis/ai')
    public async getAIAnalysisStocks(): Promise<GetAiAnalysisStocksResponse> {
        return {
            data: await this.analysisRepository.getAIAnalysisStocks(),
        };
    }
}
