import { Module } from '@nestjs/common';
import { StockInvestorModule } from './stock-investor';

const serviceModules = [StockInvestorModule];

@Module({
    imports: [...serviceModules],
    exports: [...serviceModules],
})
export class AppServiceModule {}
