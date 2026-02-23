import { Controller, Get, Param, Post } from '@nestjs/common';
import {
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { ReportType } from '@app/modules/repositories/ai-analysis-report';
import { GetAnalysisReportResponse, GetAnalysisReportsResponse } from './dto';
import {
    GetAnalysisReportsUseCase,
    GetAnalysisReportUseCase,
    RequestAnalysisUseCase,
} from './use-cases';

@ApiTags('Analysis')
@Controller('v1/analysis')
export class AnalysisController {
    constructor(
        private readonly requestAnalysisUseCase: RequestAnalysisUseCase,
        private readonly getAnalysisReportUseCase: GetAnalysisReportUseCase,
        private readonly getAnalysisReportsUseCase: GetAnalysisReportsUseCase,
    ) {}

    @ApiOperation({
        summary: 'AI 분석 요청',
        description:
            'Gemini를 통해 데이터 분석을 비동기로 요청합니다. 결과는 이벤트로 처리됩니다.',
    })
    @ApiParam({
        name: 'reportType',
        enum: ReportType,
        description: '리포트 유형',
        example: ReportType.Stock,
    })
    @ApiParam({
        name: 'reportTarget',
        type: String,
        description:
            '리포트 대상(예: 유형이 종목일 경우 종목코드, 최신 뉴스 분석인 경우 reportType 그대로 입력)',
        example: '005930',
    })
    @ApiNoContentResponse({
        description: '비동기 요청 수락됨. 결과는 이벤트 기반 처리됨.',
    })
    @Post('reports/:reportType/:reportTarget')
    public async requestAIAnalysis(
        @Param('reportType') reportType: ReportType,
        @Param('reportTarget') reportTarget: string,
    ) {
        await this.requestAnalysisUseCase.execute({
            reportType,
            reportTarget,
        });
    }

    @ApiOperation({
        summary: 'AI 분석 리포트 조회',
        description: 'Gemini를 통해 분석된 리포트를 조회합니다.',
    })
    @ApiParam({
        name: 'reportType',
        enum: ReportType,
        description: '리포트 유형',
        example: ReportType.Stock,
    })
    @ApiParam({
        name: 'reportTarget',
        type: String,
        description: '리포트 대상(예: 유형이 종목일 경우 종목코드)',
        example: '005930',
    })
    @ApiOkResponse({
        type: GetAnalysisReportResponse,
    })
    @Get('reports/:reportType/:reportTarget')
    public async getReport(
        @Param('reportType') reportType: ReportType,
        @Param('reportTarget') reportTarget: string,
    ): Promise<GetAnalysisReportResponse> {
        return this.getAnalysisReportUseCase.execute({
            reportType,
            reportTarget,
        });
    }

    @ApiOperation({
        summary: 'AI 분석 리포트 목록 조회',
        description: 'Gemini를 통해 분석된 리포트 목록을 조회합니다.',
    })
    @ApiParam({
        name: 'reportType',
        enum: ReportType,
        description: '리포트 유형',
        example: ReportType.Stock,
    })
    @ApiOkResponse({
        type: GetAnalysisReportsResponse,
    })
    @Get('reports/:reportType')
    public async getReports(
        @Param('reportType') reportType: ReportType,
    ): Promise<GetAnalysisReportsResponse> {
        return this.getAnalysisReportsUseCase.execute({
            reportType,
        });
    }
}
