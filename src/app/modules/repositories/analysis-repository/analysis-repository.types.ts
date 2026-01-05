export enum KoreaInvestmentAnalysisKey {
    AiAnalysisStocks = 'analysis:stocks:ai',
}

export interface AiAnalysisStock {
    stockCode: string;
    stockName: string;
    content: string;
    updatedAt: Date;
}
