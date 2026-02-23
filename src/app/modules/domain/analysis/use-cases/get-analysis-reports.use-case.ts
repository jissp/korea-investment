import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import {
    AiAnalysisReportService,
    ReportType,
} from '@app/modules/repositories/ai-analysis-report';
import { GetAnalysisReportsResponse } from '../dto';

export interface GetAnalysisReportsArgs {
    reportType: ReportType;
}

@Injectable()
export class GetAnalysisReportsUseCase implements BaseUseCase<
    GetAnalysisReportsArgs,
    GetAnalysisReportsResponse
> {
    constructor(
        private readonly aiAnalysisReportService: AiAnalysisReportService,
    ) {}

    async execute(
        args: GetAnalysisReportsArgs,
    ): Promise<GetAnalysisReportsResponse> {
        const reports = await this.aiAnalysisReportService.getReportsByType({
            reportType: args.reportType,
        });

        return {
            data: reports,
        };
    }
}
