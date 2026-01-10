import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MostViewedStock } from './most-viewed-stock.entity';
import { MostViewedStockService } from './most-viewed-stock.service';

const entities = [MostViewedStock];

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    providers: [MostViewedStockService],
    exports: [TypeOrmModule.forFeature(entities), MostViewedStockService],
})
export class MostViewedStockModule {}
