import { Module } from '@nestjs/common';
import { AccountModule } from './account';
import { AccountStockGroupModule } from './account-stock-group';
import { AiAnalysisReportModule } from './ai-analysis-report';
import { FavoriteStockModule } from './favorite-stock';
import { KeywordModule } from './keyword';
import { MarketIndexModule } from './market-index';
import { MostViewedStockModule } from './most-viewed-stock';
import { NewsModule } from './news';
import { StockModule } from './stock';
import { StockDailyInvestorModule } from './stock-daily-investor';
import { TradingVolumeRankModule } from './trading-volume-rank';
import { ThemeModule } from './theme';

const repositoryModules = [
    AccountModule,
    AccountStockGroupModule,
    AiAnalysisReportModule,
    FavoriteStockModule,
    KeywordModule,
    MarketIndexModule,
    MostViewedStockModule,
    NewsModule,
    StockModule,
    StockDailyInvestorModule,
    TradingVolumeRankModule,
    ThemeModule,
];

@Module({
    imports: [...repositoryModules],
    exports: [...repositoryModules],
})
export class RepositoryModule {}
