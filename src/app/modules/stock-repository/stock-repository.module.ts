import { Module } from '@nestjs/common';
import { RedisModule } from '@modules/redis';
import { StockRepository } from './stock.repository';

@Module({
    imports: [RedisModule],
    providers: [StockRepository],
    exports: [StockRepository],
})
export class StockRepositoryModule {}
