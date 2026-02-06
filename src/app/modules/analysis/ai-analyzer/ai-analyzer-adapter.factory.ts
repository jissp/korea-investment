import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ReportType } from '@app/modules/repositories/ai-analysis-report';
import { BaseAnalysisAdapter } from '@app/modules/analysis/ai-analyzer/common';
import { AiAnalyzerProvider } from '@app/modules/analysis/ai-analyzer/ai-analyzer.types';

@Injectable()
export class AiAnalyzerAdapterFactory {
    constructor(
        @Inject(AiAnalyzerProvider.AdapterMap)
        private readonly adapterMap: Map<
            ReportType,
            BaseAnalysisAdapter<unknown>
        >,
    ) {}

    /**
     * Report Type에 맞는 Adapter를 반환합니다.
     * @param reportType
     */
    create(reportType: ReportType): BaseAnalysisAdapter<unknown> {
        const adapter = this.adapterMap.get(reportType);
        if (!adapter) {
            throw new BadRequestException(
                `Unsupported report type: ${reportType}`,
            );
        }

        return adapter;
    }
}
