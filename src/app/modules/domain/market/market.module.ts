import { Module } from '@nestjs/common';
import { KoreaInvestmentCalendarModule } from '@app/modules/repositories/korea-investment-calendar';
import { MarketIndexModule } from '@app/modules/repositories/market-index';
import { MarketController } from './market.controller';
import {
    GetDomesticIndicesUseCase,
    GetMarketCalendarUseCase,
    GetOverseasGovernmentBondsUseCase,
    GetOverseasIndicesUseCase,
} from './use-cases';

@Module({
    imports: [KoreaInvestmentCalendarModule, MarketIndexModule],
    controllers: [MarketController],
    providers: [
        GetMarketCalendarUseCase,
        GetDomesticIndicesUseCase,
        GetOverseasIndicesUseCase,
        GetOverseasGovernmentBondsUseCase,
    ],
    exports: [
        GetMarketCalendarUseCase,
        GetDomesticIndicesUseCase,
        GetOverseasIndicesUseCase,
        GetOverseasGovernmentBondsUseCase,
    ],
})
export class MarketModule {}
