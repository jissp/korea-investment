import { DynamicModule, Module } from '@nestjs/common';
import { RedisModule } from '@modules/redis';
import { NewsModule } from '@app/modules/news';
import { KoreaInvestmentSettingListener } from './korea-investment-setting.listener';
import { KoreaInvestmentSettingService } from './korea-investment-setting.service';

@Module({})
export class KoreaInvestmentSettingModule {
    public static forRoot(): DynamicModule {
        return {
            module: KoreaInvestmentSettingModule,
            global: true,
            imports: [RedisModule.forFeature(), NewsModule],
            providers: [
                KoreaInvestmentSettingListener,
                KoreaInvestmentSettingService,
            ],
            exports: [KoreaInvestmentSettingService],
        };
    }
}
