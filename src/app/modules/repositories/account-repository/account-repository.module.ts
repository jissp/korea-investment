import { Module } from '@nestjs/common';
import { RedisModule } from '@modules/redis';
import { AccountRepository } from './account.repository';

@Module({
    imports: [RedisModule.forFeature()],
    providers: [AccountRepository],
    exports: [AccountRepository],
})
export class AccountRepositoryModule {}
