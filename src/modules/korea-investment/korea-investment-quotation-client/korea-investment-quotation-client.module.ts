import { Module } from '@nestjs/common';
import {
    CredentialType,
    KoreaInvestmentHelperModule,
} from '@modules/korea-investment/korea-investment-helper';
import { KoreaInvestmentQuotationClient } from './korea-investment-quotation.client';

@Module({
    imports: [KoreaInvestmentHelperModule.forFeature(CredentialType.Main)],
    providers: [KoreaInvestmentQuotationClient],
    exports: [KoreaInvestmentQuotationClient],
})
export class KoreaInvestmentQuotationClientModule {}
