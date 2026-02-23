import { Module } from '@nestjs/common';
import { RepositoryModule } from '@app/modules/repositories/repository.module';
import { AppServiceModule } from '@app/modules/app-services/app-service.module';
import { KoreaInvestmentQuotationClientModule } from '@modules/korea-investment/korea-investment-quotation-client';
import { GetStockInvestorsUseCase } from './use-cases';
import { StockInvestorController } from './stock-investor.controller';

@Module({
    imports: [
        RepositoryModule,
        AppServiceModule,
        KoreaInvestmentQuotationClientModule,
    ],
    controllers: [StockInvestorController],
    providers: [GetStockInvestorsUseCase],
    exports: [],
})
export class StockInvestorModule {}
