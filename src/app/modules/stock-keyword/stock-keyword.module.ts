import { Module } from '@nestjs/common';
import { KoreaInvestmentSettingModule } from '@app/modules/korea-investment-setting';
import { StockModule } from '@app/modules/stock';
import { StockKeywordListener } from './stock-keyword.listener';
import { StockKeywordService } from './stock-keyword.service';

@Module({
    imports: [KoreaInvestmentSettingModule, StockModule],
    providers: [StockKeywordListener, StockKeywordService],
    exports: [StockKeywordService],
})
export class StockKeywordModule {}
