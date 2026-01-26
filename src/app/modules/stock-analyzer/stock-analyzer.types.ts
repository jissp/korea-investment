import { GeminiCliModel } from '@modules/gemini-cli';
import { ReportType } from '@app/modules/repositories/ai-analysis-report';

export enum StockAnalyzerFlowType {
    RequestAnalysis = 'RequestAnalysis',
    RequestStockAnalysis = 'RequestStockAnalysis',
    RequestLatestNews = 'RequestLatestNews',
}

export enum StockAnalyzerQueueType {
    PromptToGeminiCli = 'PromptToGeminiCli',
}

export interface RequestAnalysisBody {
    reportType: ReportType;
    reportTarget: string;
    title: string;
}

export interface PromptToGeminiCliBody {
    prompt: string;
    model: GeminiCliModel;
}
