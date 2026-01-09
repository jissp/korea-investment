import { FavoriteType } from '@app/modules/repositories/favorite-stock';
import { KeywordType } from '@app/modules/repositories/keyword';

/**
 * @param stockCodeType
 * @private
 */
export function toKeywordType(stockCodeType: FavoriteType): KeywordType {
    switch (stockCodeType) {
        case FavoriteType.Manual:
            return KeywordType.Manual;
        case FavoriteType.Possess:
            return KeywordType.Possess;
        case FavoriteType.StockGroup:
            return KeywordType.StockGroup;
    }
}
