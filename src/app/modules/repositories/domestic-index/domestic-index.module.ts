import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomesticIndex } from './domestic-index.entity';
import { DomesticIndexService } from './domestic-index.service';

const entities = [DomesticIndex];

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    providers: [DomesticIndexService],
    exports: [TypeOrmModule.forFeature(entities), DomesticIndexService],
})
export class DomesticIndexModule {}
