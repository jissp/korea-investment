import { Module } from '@nestjs/common';
import {
    CredentialType,
    KoreaInvestmentHelperModule,
} from '@modules/korea-investment/korea-investment-helper';
import { KoreaInvestmentRankClient } from './korea-investment-rank.client';

@Module({
    imports: [KoreaInvestmentHelperModule.forFeature(CredentialType.Main)],
    providers: [KoreaInvestmentRankClient],
    exports: [KoreaInvestmentRankClient],
})
export class KoreaInvestmentRankClientModule {}
