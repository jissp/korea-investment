import { Module } from '@nestjs/common';
import { RedisModule } from '@modules/redis';
import { IndexRepository } from './index.repository';

@Module({
    imports: [RedisModule.forFeature()],
    providers: [IndexRepository],
    exports: [IndexRepository],
})
export class IndexRepositoryModule {}
