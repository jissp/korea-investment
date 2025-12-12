import { Module } from '@nestjs/common';
import { KoreaInvestmentSettingService } from './korea-investment-setting.service';

@Module({
    imports: [],
    providers: [KoreaInvestmentSettingService],
    exports: [KoreaInvestmentSettingService],
})
export class KoreaInvestmentSettingModule {}
