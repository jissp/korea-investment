import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TradingVolumeRank } from './trading-volume-rank.entity';
import { TradingVolumeRankService } from './trading-volume-rank.service';

const entities = [TradingVolumeRank];

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    providers: [TradingVolumeRankService],
    exports: [TypeOrmModule.forFeature(entities), TradingVolumeRankService],
})
export class TradingVolumeRankModule {}
