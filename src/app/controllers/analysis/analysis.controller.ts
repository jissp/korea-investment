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
import { AiAnalyzerService } from '@app/modules/ai-analyzer';
import {
    AiAnalysisReportService,
    ReportType,
} from '@app/modules/repositories/ai-analysis-report';
import {
    GetAiAnalysisReportResponse,
    GetAiAnalysisReportsResponse,
} from './dto';

@ApiTags('Analysis')
@Controller('v1/analysis')
export class AnalysisController {
    constructor(
        private readonly stockAnalyzerService: AiAnalyzerService,
        private readonly aiAnalysisReportService: AiAnalysisReportService,
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
    @ApiNoContentResponse()
    @Post('reports/:reportType/:reportTarget')
    public async requestAIAnalysis(
        @Param('reportType') reportType: ReportType,
        @Param('reportTarget') reportTarget: string,
    ) {
        try {
            await this.stockAnalyzerService.requestAnalysis(
                reportType,
                reportTarget,
            );
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
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
        type: GetAiAnalysisReportResponse,
    })
    @Get('reports/:reportType/:reportTarget')
    public async getReport(
        @Param('reportType') reportType: ReportType,
        @Param('reportTarget') reportTarget: string,
    ): Promise<GetAiAnalysisReportResponse> {
        const report = await this.aiAnalysisReportService.getReport({
            reportType,
            reportTarget,
        });

        return {
            data: report,
        };
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
        type: GetAiAnalysisReportsResponse,
    })
    @Get('reports/:reportType')
    public async getReports(
        @Param('reportType') reportType: ReportType,
    ): Promise<GetAiAnalysisReportsResponse> {
        const reports = await this.aiAnalysisReportService.getReportsByType({
            reportType,
        });

        return {
            data: reports,
        };
    }
}
