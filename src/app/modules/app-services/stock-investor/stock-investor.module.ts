import { Module } from '@nestjs/common';
import { KoreaInvestmentQuotationClientModule } from '@modules/korea-investment/korea-investment-quotation-client';
import { StockModule } from '@app/modules/repositories/stock';
import { StockInvestorModule as StockInvestorRepositoryModule } from '@app/modules/repositories/stock-investor';
import { StockInvestorService } from './stock-investor.service';

@Module({
    imports: [
        KoreaInvestmentQuotationClientModule,
        StockInvestorRepositoryModule,
        StockModule,
    ],
    providers: [StockInvestorService],
    exports: [StockInvestorService],
})
export class StockInvestorModule {}
