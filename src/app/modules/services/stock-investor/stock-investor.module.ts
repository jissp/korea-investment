import { Module } from '@nestjs/common';
import { KoreaInvestmentQuotationClientModule } from '@modules/korea-investment/korea-investment-quotation-client';
import { StockModule } from '@app/modules/repositories/stock';
import { StockDailyInvestorModule } from '@app/modules/repositories/stock-daily-investor';
import { StockInvestorService } from './stock-investor.service';

@Module({
    imports: [
        KoreaInvestmentQuotationClientModule,
        StockDailyInvestorModule,
        StockModule,
    ],
    providers: [StockInvestorService],
    exports: [StockInvestorService],
})
export class StockInvestorModule {}
