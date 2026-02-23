import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { AiAnalyzerService } from '@app/modules/analysis/ai-analyzer';
import { ReportType } from '@app/modules/repositories/ai-analysis-report';

export interface RequestAnalysisArgs {
    reportType: ReportType;
    reportTarget: string;
}

@Injectable()
export class RequestAnalysisUseCase implements BaseUseCase<
    RequestAnalysisArgs,
    void
> {
    constructor(private readonly aiAnalyzerService: AiAnalyzerService) {}

    async execute(args: RequestAnalysisArgs): Promise<void> {
        try {
            await this.aiAnalyzerService.requestAnalysis(
                args.reportType,
                args.reportTarget,
            );
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
