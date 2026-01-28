import { AiAnalysisReport } from './ai-analysis-report.entity';

export enum ReportType {
    Stock = 'stock',
    Market = 'market',
    ExhaustionTrace = 'exhaustionTrace',
}

export type AiAnalysisReportDto = Omit<
    AiAnalysisReport,
    'id' | 'createdAt' | 'updatedAt'
>;
