import { DynamicModule, Module } from '@nestjs/common';
import { RedisHelper, RedisModule, RedisSet } from '@modules/redis';
import { NewsModule } from '@app/modules/news';
import { KoreaInvestmentSettingService } from './korea-investment-setting.service';
import { KoreaInvestmentKeywordSettingService } from './korea-investment-keyword-setting.service';
import {
    KeywordType,
    KoreaInvestmentKeywordSettingKey,
} from '@app/modules/korea-investment-setting/korea-investment-keyword-setting.types';

@Module({})
export class KoreaInvestmentSettingModule {
    public static forRoot(): DynamicModule {
        return {
            module: KoreaInvestmentSettingModule,
            global: true,
            imports: [RedisModule.forFeature(), NewsModule],
            providers: [
                {
                    provide: 'KeywordSetMap',
                    inject: [RedisHelper],
                    useFactory: (redisHelper: RedisHelper) => {
                        return new Map<KeywordType, RedisSet>([
                            [
                                KeywordType.Manual,
                                redisHelper.createSet(
                                    KoreaInvestmentKeywordSettingKey.ManualKeywords,
                                ),
                            ],
                            [
                                KeywordType.Possess,
                                redisHelper.createSet(
                                    KoreaInvestmentKeywordSettingKey.PossessKeywords,
                                ),
                            ],
                            [
                                KeywordType.StockGroup,
                                redisHelper.createSet(
                                    KoreaInvestmentKeywordSettingKey.StockGroupKeywords,
                                ),
                            ],
                        ]);
                    },
                },
                KoreaInvestmentSettingService,
                KoreaInvestmentKeywordSettingService,
            ],
            exports: [
                KoreaInvestmentSettingService,
                KoreaInvestmentKeywordSettingService,
            ],
        };
    }
}
