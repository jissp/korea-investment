import { AiAnalysisReport } from '@app/modules/repositories/ai-analysis-report/ai-analysis-report.entity';

export enum ReportType {
    Stock = 'stock',
    KeywordGroup = 'keywordGroup',
}

export type AiAnalysisReportDto = Omit<
    AiAnalysisReport,
    'id' | 'createdAt' | 'updatedAt'
>;
