export enum KoreaInvestmentSettingKey {
    Accounts = 'setting:accounts',

    StockCodes = 'setting:stock-codes',
    ManualStockCodes = 'setting:stock-codes:manual',
    PossessStockCodes = 'setting:stock-codes:possess',
    StockGroupStockCodes = 'setting:stock-codes:stock-group',
    FavoriteStockCodes = 'setting:stock-codes:favorite',
}

export enum KoreaInvestmentSettingEvent {
    AllStockCodeEvent = 'KoreaInvestmentSettingEvent.StockCode.*',
    UpdatedStockCode = 'KoreaInvestmentSettingEvent.StockCode.Updated',
    DeletedStockCode = 'KoreaInvestmentSettingEvent.StockCode.Deleted',
}
