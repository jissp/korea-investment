import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './stock.entity';
import { StockService } from './stock.service';

const entities = [Stock];

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    providers: [StockService],
    exports: [TypeOrmModule.forFeature(entities), StockService],
})
export class StockModule {}
