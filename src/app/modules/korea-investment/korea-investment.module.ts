import { Module } from '@nestjs/common';
import { KoreaInvestmentQuotationClientModule } from '@modules/korea-investment/korea-investment-client/korea-investment-quotation-client';
import { KoreaInvestmentRankClientModule } from '@modules/korea-investment/korea-investment-client/korea-investment-rank-client';
import {
    AssetController,
    QuotationController,
    RankController,
} from './controllers';

@Module({
    imports: [
        KoreaInvestmentQuotationClientModule,
        KoreaInvestmentRankClientModule,
    ],
    controllers: [AssetController, QuotationController, RankController],
    providers: [],
})
export class KoreaInvestmentModule {}
