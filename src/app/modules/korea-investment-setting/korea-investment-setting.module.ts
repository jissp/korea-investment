import { DynamicModule, Module } from '@nestjs/common';
import { RedisHelper, RedisModule, RedisSet } from '@modules/redis';
import { NewsModule } from '@app/modules/news';
import {
    KeywordType,
    KoreaInvestmentKeywordSettingKey,
    StockCodeType,
} from './korea-investment-keyword-setting.types';
import { KoreaInvestmentSettingKey } from './korea-investment-setting.types';
import { KoreaInvestmentSettingService } from './korea-investment-setting.service';
import { KoreaInvestmentKeywordSettingService } from './korea-investment-keyword-setting.service';

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
                            [
                                KeywordType.Favorite,
                                redisHelper.createSet(
                                    KoreaInvestmentKeywordSettingKey.FavoriteKeywords,
                                ),
                            ],
                        ]);
                    },
                },
                {
                    provide: 'StockCodeSetMap',
                    inject: [RedisHelper],
                    useFactory: (redisHelper: RedisHelper) => {
                        return new Map<StockCodeType, RedisSet>([
                            [
                                StockCodeType.Manual,
                                redisHelper.createSet(
                                    KoreaInvestmentSettingKey.ManualStockCodes,
                                ),
                            ],
                            [
                                StockCodeType.Possess,
                                redisHelper.createSet(
                                    KoreaInvestmentSettingKey.PossessStockCodes,
                                ),
                            ],
                            [
                                StockCodeType.StockGroup,
                                redisHelper.createSet(
                                    KoreaInvestmentSettingKey.StockGroupStockCodes,
                                ),
                            ],
                            [
                                StockCodeType.Favorite,
                                redisHelper.createSet(
                                    KoreaInvestmentSettingKey.FavoriteStockCodes,
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
