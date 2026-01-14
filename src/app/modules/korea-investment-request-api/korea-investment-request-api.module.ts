import { Module } from '@nestjs/common';
import { KoreaInvestmentRequestApiHelper } from '@app/modules/korea-investment-request-api/common';

@Module({
    providers: [KoreaInvestmentRequestApiHelper],
    exports: [KoreaInvestmentRequestApiHelper],
})
export class KoreaInvestmentRequestApiModule {}
