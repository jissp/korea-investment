import { Inject, Injectable } from '@nestjs/common';
import { ReportType } from '@app/modules/repositories/ai-analysis-report';
import { BaseAnalysisAdapter } from '@app/modules/analysis/ai-analyzer/common';
import { AiAnalyzerProvider } from '@app/modules/analysis/ai-analyzer/ai-analyzer.types';

@Injectable()
export class AiAnalyzerAdapterFactory {
    constructor(
        @Inject(AiAnalyzerProvider.AdapterMap)
        private readonly adapterMap: Map<ReportType, BaseAnalysisAdapter<any>>,
    ) {}

    /**
     * Report Type에 맞는 Adapter를 반환합니다.
     * @param reportType
     */
    create(reportType: ReportType): BaseAnalysisAdapter<any> {
        const adapter = this.adapterMap.get(reportType);
        if (!adapter) {
            throw new Error(`Unsupported report type: ${reportType}`);
        }

        return adapter;
    }
}
