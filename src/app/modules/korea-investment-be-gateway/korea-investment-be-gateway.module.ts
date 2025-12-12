import { Module } from '@nestjs/common';
import { KoreaInvestmentBeGateway } from './korea-investment-be.gateway';

@Module({
    imports: [],
    providers: [KoreaInvestmentBeGateway],
})
export class KoreaInvestmentBeGatewayModule {}
