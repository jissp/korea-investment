export enum KoreaInvestmentAccountCrawlerType {
    RequestAccount = 'RequestAccount',
    RequestAccountStocks = 'RequestAccountStocks',
    RequestAccountStockGroups = 'RequestAccountStockGroups',
    RequestAccountStocksByGroup = 'RequestAccountStocksByGroup',
    UpdateAccountStockGroupStockPrices = 'UpdateAccountStockGroupStockPrices',
}

export enum KoreaInvestmentAccountCrawlerEventType {
    UpdatedStockGroup = 'KoreaInvestmentAccountCrawler.UpdatedStockGroup',
}
