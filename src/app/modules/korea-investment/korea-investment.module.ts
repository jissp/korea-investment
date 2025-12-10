import { Module } from '@nestjs/common';
import { KoreaInvestmentQuotationClientModule } from '@modules/korea-investment/korea-investment-client/korea-investment-quotation-client';
import { KoreaInvestmentRankClientModule } from '@modules/korea-investment/korea-investment-client/korea-investment-rank-client';
import { KoreaInvestmentWebSocketModule } from '@modules/korea-investment/korea-investment-web-socket';
import { KoreaInvestmentWebSocketGateway } from './gateways';
import { AssetController } from './asset/asset.controller';
import { AssetService } from './asset/asset.service';
import { QuotationController } from './quotation/quotation.controller';
import { RankController } from './rank/rank.controller';

const Services = [AssetService];

@Module({
    imports: [
        KoreaInvestmentQuotationClientModule,
        KoreaInvestmentRankClientModule,
        KoreaInvestmentWebSocketModule,
    ],
    controllers: [AssetController, QuotationController, RankController],
    providers: [KoreaInvestmentWebSocketGateway, ...Services],
})
export class KoreaInvestmentModule {}
