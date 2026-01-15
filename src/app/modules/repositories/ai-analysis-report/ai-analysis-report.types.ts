import { AiAnalysisReport } from './ai-analysis-report.entity';

export enum ReportType {
    Stock = 'stock',
    KeywordGroup = 'keywordGroup',
    LatestNews = 'LatestNews',
}

export type AiAnalysisReportDto = Omit<
    AiAnalysisReport,
    'id' | 'createdAt' | 'updatedAt'
>;
