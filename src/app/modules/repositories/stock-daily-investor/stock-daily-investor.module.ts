import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockDailyInvestor } from './stock-daily-investor.entity';
import { StockDailyInvestorService } from './stock-daily-investor.service';

const entities = [StockDailyInvestor];

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    providers: [StockDailyInvestorService],
    exports: [TypeOrmModule.forFeature(entities), StockDailyInvestorService],
})
export class StockDailyInvestorModule {}
