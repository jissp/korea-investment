import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MarketIndex } from './market-index.entity';
import { MarketIndexService } from './market-index.service';

const entities = [MarketIndex];

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    providers: [MarketIndexService],
    exports: [TypeOrmModule.forFeature(entities), MarketIndexService],
})
export class MarketIndexModule {}
