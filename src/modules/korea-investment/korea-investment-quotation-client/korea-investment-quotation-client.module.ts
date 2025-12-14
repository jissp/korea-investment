import { Module } from '@nestjs/common';
import { KoreaInvestmentHelperModule } from '@modules/korea-investment/korea-investment-helper';
import { KoreaInvestmentQuotationClient } from './korea-investment-quotation.client';

@Module({
    imports: [KoreaInvestmentHelperModule],
    providers: [KoreaInvestmentQuotationClient],
    exports: [KoreaInvestmentQuotationClient],
})
export class KoreaInvestmentQuotationClientModule {}
