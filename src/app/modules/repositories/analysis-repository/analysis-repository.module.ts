import { Module } from '@nestjs/common';
import { RedisModule } from '@modules/redis';
import { AnalysisRepository } from './analysis.repository';

@Module({
    imports: [RedisModule.forFeature()],
    providers: [AnalysisRepository],
    exports: [AnalysisRepository],
})
export class AnalysisRepositoryModule {}
