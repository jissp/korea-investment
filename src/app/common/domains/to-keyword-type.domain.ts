import { KeywordType, StockCodeType, } from '@app/modules/korea-investment-setting';

/**
 * @param stockCodeType
 * @private
 */
export function toKeywordType(stockCodeType: StockCodeType): KeywordType {
    switch (stockCodeType) {
        case StockCodeType.Manual:
            return KeywordType.Manual;
        case StockCodeType.Possess:
            return KeywordType.Possess;
        case StockCodeType.StockGroup:
            return KeywordType.StockGroup;
        case StockCodeType.Favorite:
            return KeywordType.Favorite;
    }
}
