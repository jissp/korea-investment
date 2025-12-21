import { Module } from '@nestjs/common';
import { RedisModule } from '@modules/redis';
import { KoreaInvestmentAccountService } from './korea-investment-acount.service';

@Module({
    imports: [RedisModule.forFeature()],
    providers: [KoreaInvestmentAccountService],
    exports: [KoreaInvestmentAccountService],
})
export class KoreaInvestmentAccountModule {}
