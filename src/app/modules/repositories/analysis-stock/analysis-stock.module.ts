import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalysisStockEntity } from './analysis-stock.entity';
import { AnalysisStockService } from './analysis-stock.service';

const entities = [AnalysisStockEntity];

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    providers: [AnalysisStockService],
    exports: [TypeOrmModule.forFeature(entities), AnalysisStockService],
})
export class AnalysisStockModule {}
