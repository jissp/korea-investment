import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockInvestor } from './stock-investor.entity';
import { StockInvestorService } from './stock-investor.service';

const entities = [StockInvestor];
const services = [StockInvestorService];

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    providers: [...services],
    exports: [TypeOrmModule.forFeature(entities), ...services],
})
export class StockInvestorModule {}
