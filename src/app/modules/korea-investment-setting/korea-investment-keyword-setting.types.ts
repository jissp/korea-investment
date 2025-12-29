export enum KeywordType {
    Manual = 'Manual',
    Possess = 'Possess',
    StockGroup = 'StockGroup',
}

export enum KoreaInvestmentKeywordSettingKey {
    Keywords = 'Setting:Keywords',
    KeywordsByStock = 'Setting:Keywords:Stock',
    StocksByKeyword = 'Setting:Stocks:Keyword',

    ManualKeywords = 'Setting:Keywords:Manual',
    PossessKeywords = 'Setting:Keywords:Possess',
    StockGroupKeywords = 'Setting:Keywords:StockGroup',
}

/**
 * TODO DeletedKeyword 등 이벤트 유지할 필요있는지 검토 필요
 */
export enum KoreaInvestmentKeywordSettingEvent {
    UpdatedKeyword = 'KoreaInvestmentSettingEvent.UpdatedKeyword',
    DeletedKeyword = 'DeletedKeyword',
    DeletedStockCode = 'DeletedStockCode',
    AddedStockKeyword = 'AddedStockKeyword',
    DeletedStockKeyword = 'DeletedStockKeyword',
}
