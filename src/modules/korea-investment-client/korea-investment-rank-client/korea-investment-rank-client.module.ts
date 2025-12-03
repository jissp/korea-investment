import { Module } from '@nestjs/common';
import { KoreaInvestmentHelperModule } from '@modules/korea-investment-client/korea-investment-helper';
import { KoreaInvestmentRankClient } from './korea-investment-rank.client';

@Module({
    imports: [KoreaInvestmentHelperModule],
    providers: [KoreaInvestmentRankClient],
    exports: [KoreaInvestmentRankClient],
})
export class KoreaInvestmentRankClientModule {}
