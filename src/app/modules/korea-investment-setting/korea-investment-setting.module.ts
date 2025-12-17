import { Module } from '@nestjs/common';
import { RedisModule } from '@modules/redis';
import { KoreaInvestmentSettingHelperService } from './korea-investment-setting-helper.service';

@Module({
    imports: [RedisModule.forFeature()],
    providers: [KoreaInvestmentSettingHelperService],
    exports: [KoreaInvestmentSettingHelperService],
})
export class KoreaInvestmentSettingModule {}
