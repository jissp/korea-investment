export enum MarketType {
    Domestic = 'domestic',
    Overseas = 'overseas',
}

export enum ExchangeType {
    KOSPI = 'kospi',
    KOSDAQ = 'kosdaq',
    NYSE = 'nyse',
    NASDAQ = 'nasdaq',
}

export const DOMESTIC_INDEX_CODES = [
    {
        code: '0001',
        name: '코스피',
    },
    {
        code: '1001',
        name: '코스닥',
    },
];

export const OVERSEAS_INDEX_CODES = [
    {
        code: '.DJI',
        name: '다우존스 산업지수',
    },
    {
        code: 'COMP',
        name: '나스닥 종합',
    },
    {
        code: 'SPX',
        name: 'S&P500',
    },
    {
        code: 'SOX',
        name: '필라델피아 반도체지수',
    },
];

export const OVERSEAS_GOVERNMENT_BOND_CODES = [
    { code: 'Y0104', name: '국고채 1년' },
    { code: 'Y0101', name: '국고채 3년' },
    { code: 'Y0105', name: '국고채 5년' },
    { code: 'Y0106', name: '국고채 10년' },
];
