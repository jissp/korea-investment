import { Module } from '@nestjs/common';
import { KoreaInvestmentQuotationClientModule } from '@modules/korea-investment/korea-investment-client/korea-investment-quotation-client';
import { KoreaInvestmentRankClientModule } from '@modules/korea-investment/korea-investment-client/korea-investment-rank-client';
import { KoreaInvestmentWebSocketModule } from '@modules/korea-investment/korea-investment-web-socket';
import { KoreaInvestmentWebSocketGateway } from './gateways';
import {
    AssetController,
    QuotationController,
    RankController,
} from './controllers';

@Module({
    imports: [
        KoreaInvestmentQuotationClientModule,
        KoreaInvestmentRankClientModule,
        KoreaInvestmentWebSocketModule,
    ],
    controllers: [AssetController, QuotationController, RankController],
    providers: [KoreaInvestmentWebSocketGateway],
})
export class KoreaInvestmentModule {}
