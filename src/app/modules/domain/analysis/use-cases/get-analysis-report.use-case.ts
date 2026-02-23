import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import {
    AiAnalysisReportService,
    ReportType,
} from '@app/modules/repositories/ai-analysis-report';
import { GetAnalysisReportResponse } from '../dto';

export interface GetAnalysisReportArgs {
    reportType: ReportType;
    reportTarget: string;
}

@Injectable()
export class GetAnalysisReportUseCase implements BaseUseCase<
    GetAnalysisReportArgs,
    GetAnalysisReportResponse
> {
    constructor(
        private readonly aiAnalysisReportService: AiAnalysisReportService,
    ) {}

    async execute(
        args: GetAnalysisReportArgs,
    ): Promise<GetAnalysisReportResponse> {
        const report = await this.aiAnalysisReportService.getReport({
            reportType: args.reportType,
            reportTarget: args.reportTarget,
        });

        return {
            data: report,
        };
    }
}
