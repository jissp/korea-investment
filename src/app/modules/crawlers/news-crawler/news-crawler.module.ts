import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { StockPlusModule } from '@modules/stock-plus';
import { NaverApiModule } from '@modules/naver/naver-api';
import { KoreaInvestmentAdditionalRequestApiModule } from '@app/modules/korea-investment-request-api/korea-investment-additional-request-api';
import { NewsModule } from '@app/modules/repositories/news';
import { FavoriteStockModule } from '@app/modules/repositories/favorite-stock';
import { KeywordModule } from '@app/modules/repositories/keyword';
import {
    NewsCrawlerProvider,
    NewsCrawlerQueueType,
    NewsStrategy,
} from './news-crawler.types';
import { NewsCrawlerFactory } from './news-crawler.factory';
import { NewsCrawlerSchedule } from './news-crawler.schedule';
import { NewsCrawlerProcessor } from './news-crawler.processor';
import {
    BaseStrategy,
    KoreaInvestmentStrategy,
    NaverStrategy,
    StockPlusStrategy,
} from './strategies';

const flowTypes = [NewsCrawlerQueueType.RequestCrawlingNews];
const flowProviders = QueueModule.getFlowProviders(flowTypes);
const strategies = [KoreaInvestmentStrategy, NaverStrategy, StockPlusStrategy];

@Module({
    imports: [
        QueueModule.forFeature({
            flowTypes,
            jobOptions: {
                removeOnComplete: {
                    count: 3,
                },
                removeOnFail: {
                    count: 5,
                },
            },
        }),
        KoreaInvestmentAdditionalRequestApiModule,
        NaverApiModule,
        StockPlusModule,
        NewsModule,
        FavoriteStockModule,
        KeywordModule,
    ],
    providers: [
        ...flowProviders,
        ...strategies,
        {
            provide: NewsCrawlerProvider.StrategyMap,
            inject: [KoreaInvestmentStrategy, NaverStrategy, StockPlusStrategy],
            useFactory: (
                koreaInvestmentStrategy: KoreaInvestmentStrategy,
                naverStrategy: NaverStrategy,
                stockPlusStrategy: StockPlusStrategy,
            ) => {
                const map = new Map<
                    NewsStrategy,
                    BaseStrategy<NewsStrategy, any>
                >();

                map.set(NewsStrategy.KoreaInvestment, koreaInvestmentStrategy);
                map.set(NewsStrategy.Naver, naverStrategy);
                map.set(NewsStrategy.StockPlus, stockPlusStrategy);

                return map;
            },
        },
        NewsCrawlerFactory,
        NewsCrawlerProcessor,
        NewsCrawlerSchedule,
    ],
})
export class NewsCrawlerModule {}
