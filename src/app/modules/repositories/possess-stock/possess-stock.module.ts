import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PossessStockEntity } from './possess-stock.entity';
import { PossessStockService } from './possess-stock.service';

const entities = [PossessStockEntity];

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    providers: [PossessStockService],
    exports: [TypeOrmModule.forFeature(entities), PossessStockService],
})
export class PossessStockModule {}
