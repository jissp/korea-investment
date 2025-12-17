import { Module } from '@nestjs/common';
import { KoreaInvestmentSettingModule } from '@app/modules/korea-investment-setting';
import { StockService } from './stock.service';

@Module({
    imports: [KoreaInvestmentSettingModule],
    providers: [StockService],
    exports: [StockService],
})
export class StockModule {}
