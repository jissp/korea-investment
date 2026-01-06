export enum KeywordType {
    Manual = 'Manual',
    Possess = 'Possess',
    StockGroup = 'StockGroup',
    Favorite = 'Favorite',
}

export enum StockCodeType {
    Manual = 'Manual',
    Possess = 'Possess',
    StockGroup = 'StockGroup',
    Favorite = 'Favorite',
}

export enum KoreaInvestmentKeywordSettingKey {
    Keywords = 'keywords',
    KeywordsByStock = 'setting:keywords:by-stock-code',
    StocksByKeyword = 'setting:stock-codes:by-keyword',

    ManualKeywords = 'setting:keywords:manual',
    PossessKeywords = 'setting:keywords:possess',
    StockGroupKeywords = 'setting:keywords:stock-group',
    FavoriteKeywords = 'setting:keywords:favorite',

    KeywordGroups = 'setting:keyword-groups',
    KeywordGroupsByKeyword = 'setting:keyword-groups:by-keyword',
}

/**
 * TODO DeletedKeyword 등 이벤트 유지할 필요있는지 검토 필요
 */
export enum KoreaInvestmentKeywordSettingEvent {
    DeletedKeyword = 'DeletedKeyword',
    AddedStockKeyword = 'AddedStockKeyword',
    DeletedStockKeyword = 'DeletedStockKeyword',

    AddedKeywordToGroup = 'AddedKeywordToGroup',
    DeletedKeywordFromGroup = 'DeletedKeywordFromGroup',
    DeletedKeywordGroup = 'DeletedKeywordGroup',
}
