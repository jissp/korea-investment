import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockDailyInvestor, StockHourForeignerInvestor } from './entities';
import { StockDailyInvestorService } from './stock-daily-investor.service';
import { StockHourForeignerInvestorService } from './stock-hour-foreigner-investor.service';

const entities = [StockDailyInvestor, StockHourForeignerInvestor];
const services = [StockDailyInvestorService, StockHourForeignerInvestorService];

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    providers: [...services],
    exports: [TypeOrmModule.forFeature(entities), ...services],
})
export class StockInvestorModule {}
