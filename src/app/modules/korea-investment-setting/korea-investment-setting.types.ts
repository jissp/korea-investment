export enum KoreaInvestmentSettingKey {
    StockCodes = 'Setting:StockCodes',
    Keywords = 'Setting:Keywords',
    KeywordsByStock = 'Setting:Keywords:Stock',
    StocksByKeyword = 'Setting:Stocks:Keyword',
}

export enum KoreaInvestmentSettingEvent {
    DeletedKeyword = 'DeletedKeyword',
    DeletedStockCode = 'DeletedStockCode',
    AddedStockKeyword = 'AddedStockKeyword',
    DeletedStockKeyword = 'DeletedStockKeyword',
}
