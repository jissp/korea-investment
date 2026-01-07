import { Module } from '@nestjs/common';
import { KoreaInvestmentQuotationClientModule } from '@modules/korea-investment/korea-investment-quotation-client';
import { StockRepositoryModule } from '@app/modules/repositories/stock-repository';
import { StockInvestorService } from './stock-investor.service';

@Module({
    imports: [KoreaInvestmentQuotationClientModule, StockRepositoryModule],
    providers: [StockInvestorService],
    exports: [StockInvestorService],
})
export class StockInvestorModule {}
