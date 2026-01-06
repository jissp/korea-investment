export enum KoreaInvestmentAnalysisKey {
    AiAnalysisStocks = 'analysis:ai:stocks',
    AiAnalysisKeywordGroups = 'analysis:ai:keyword-groups',
}

export interface AiAnalysisStock {
    stockCode: string;
    stockName: string;
    content: string;
    updatedAt: Date;
}

export interface AiAnalysisKeywordGroup {
    groupName: string;
    content: string;
    updatedAt: Date;
}
