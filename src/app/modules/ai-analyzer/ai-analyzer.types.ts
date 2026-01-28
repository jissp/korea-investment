import { GeminiCliModel } from '@modules/gemini-cli';
import { ReportType } from '@app/modules/repositories/ai-analysis-report';

export enum AiAnalyzerProvider {
    AdapterMap = 'AdapterMap',
}

export enum AiAnalyzerFlowType {
    RequestAnalysis = 'RequestAnalysis',
}

export enum AiAnalyzerQueueType {
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
