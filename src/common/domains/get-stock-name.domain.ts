import * as _ from 'lodash';
import * as kospiCodes from '@assets/kospi_code.json';
import * as kosdaqCodes from '@assets/kosdaq_code.json';

const codeMap = {
    ..._.keyBy(kospiCodes, 'shortCode'),
    ..._.keyBy(kosdaqCodes, 'shortCode'),
};

/**
 * 종목명을 가져옵니다.
 * @param stockCode
 */
export function getStockName(stockCode: string) {
    const stock = codeMap[stockCode];

    return stock ? stock.name : stockCode;
}
