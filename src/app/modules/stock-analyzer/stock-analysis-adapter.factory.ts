import { Injectable } from '@nestjs/common';
import { ReportType } from '@app/modules/repositories/ai-analysis-report';
import {
    KeywordGroupAnalysisAdapter,
    LatestNewsAnalysisAdapter,
    StockAnalysisAdapter,
} from './adapters';
import { IAnalysisAdapter } from './adapters/analysis-adapter.interface';

@Injectable()
export class StockAnalysisAdapterFactory {
    constructor(
        private readonly stockAnalysisAdapter: StockAnalysisAdapter,
        private readonly keywordGroupAnalysisAdapter: KeywordGroupAnalysisAdapter,
        private readonly latestNewsAnalysisAdapter: LatestNewsAnalysisAdapter,
    ) {}

    /**
     * Report Type에 맞는 Adapter를 반환합니다.
     * @param reportType
     */
    create(reportType: ReportType): IAnalysisAdapter<any> {
        switch (reportType) {
            case ReportType.Stock:
                return this.stockAnalysisAdapter;
            case ReportType.KeywordGroup:
                return this.keywordGroupAnalysisAdapter;
            case ReportType.LatestNews:
                return this.latestNewsAnalysisAdapter;
            default:
                throw new Error(`Unsupported report type: ${reportType}`);
        }
    }
}
