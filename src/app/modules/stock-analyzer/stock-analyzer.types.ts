import { ReportType } from '@app/modules/repositories/ai-analysis-report';

export enum StockAnalyzerEventType {
    AnalysisCompleted = 'StockAnalyzer.AnalysisCompleted',
    AnalysisCompletedForKeywordGroup = 'StockAnalyzer.AnalysisCompletedForKeywordGroup',
    AnalysisCompletedForLatestNews = 'StockAnalyzer.AnalysisCompletedForLatestNews',
}

export interface AnalysisCompletedEventBody {
    reportType: ReportType;
    reportTarget: string;
    title: string;
}
