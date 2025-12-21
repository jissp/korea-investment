import * as _ from 'lodash';
import * as KospiCodes from '@assets/kospi_code.json';
import * as KosdaqCodes from '@assets/kosdaq_code.json';

interface StockCodeItem {
    shortCode: string;
    code: string;
    name: string;
}

const kospiCodes: StockCodeItem[] = KospiCodes;
const kosdaqCodes: StockCodeItem[] = KosdaqCodes;

const allCodes = [...kospiCodes, ...kosdaqCodes];

const codeMap = _.keyBy(allCodes, 'shortCode');
const sortedAllCodes = _.sortBy(allCodes, 'name');

export function getStocks() {
    return sortedAllCodes;
}

/**
 * 종목명을 가져옵니다.
 * @param stockCode
 */
export function getStockName(stockCode: string) {
    const stock = codeMap[stockCode];

    return stock ? stock.name : stockCode;
}

/**
 * 종목 코드가 유효한지 검사합니다.
 * @param stockCode
 */
export function existsStockCode(stockCode: string) {
    return !!codeMap[stockCode];
}

export function searchStockCode(keyword: string) {
    return sortedAllCodes.filter(
        (stock) =>
            stock.name.includes(keyword) || stock.shortCode.includes(keyword),
    );
}
