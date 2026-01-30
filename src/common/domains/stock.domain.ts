import { keyBy, sortBy } from 'lodash';
import { BadRequestException } from '@nestjs/common';
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

const codeMap = keyBy(allCodes, 'shortCode');
const sortedAllCodes = sortBy(allCodes, 'name');

export function getStocks() {
    return sortedAllCodes;
}

/**
 * 종목명을 가져옵니다.
 * @param stockCode
 */
export function getStockName(stockCode: string): string {
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

/**
 * 키워드로 종목 코드를 검색합니다.
 * @param keyword
 */
export function searchStockCode(keyword: string) {
    return sortedAllCodes.filter(
        (stock) =>
            stock.name.includes(keyword) || stock.shortCode.includes(keyword),
    );
}

/**
 * 종목 코드가 유효한지 검사합니다.
 * @param stockCode
 */
export function assertStockCode(stockCode: string) {
    if (!existsStockCode(stockCode)) {
        throw new BadRequestException('존재하지 않는 종목 코드입니다.');
    }
}
