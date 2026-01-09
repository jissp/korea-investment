import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FavoriteStock } from './favorite-stock.entity';
import { FavoriteStockService } from './favorite-stock.service';

const entities = [FavoriteStock];

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    providers: [FavoriteStockService],
    exports: [TypeOrmModule.forFeature(entities), FavoriteStockService],
})
export class FavoriteStockModule {}
