import { Module } from '@nestjs/common';
import { NewsServiceModule } from './news-service';
import { StockInvestorModule } from './stock-investor';

const serviceModules = [NewsServiceModule, StockInvestorModule];

@Module({
    imports: [...serviceModules],
    exports: [...serviceModules],
})
export class AppServiceModule {}
