import {
    DOMESTIC_INDEX_CODES,
    OVERSEAS_GOVERNMENT_BOND_CODES,
    OVERSEAS_INDEX_CODES,
} from '@app/common/types';

const marketIndices = [
    ...DOMESTIC_INDEX_CODES,
    ...OVERSEAS_INDEX_CODES,
    ...OVERSEAS_GOVERNMENT_BOND_CODES,
];

export function getMarketName(code: string) {
    const market = marketIndices.find((market) => market.code === code);
    if (!market) {
        return code;
    }

    return market.name;
}
