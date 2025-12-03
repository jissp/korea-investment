import { Injectable } from '@nestjs/common';
import { KoreaInvestmentHelperService } from '@modules/korea-investment-client/korea-investment-helper';
import { MarketDivCode } from '@modules/korea-investment-client/common';
import {
    BaseResponse,
    DomesticStockQuotationInquireCcnlOutput,
    DomesticStockQuotationInquireIndexPriceOutput,
    DomesticStockQuotationInquirePrice2Output,
} from './korea-investment-quotation-client.types';

@Injectable()
export class KoreaInvestmentQuotationClient {
    constructor(private readonly helper: KoreaInvestmentHelperService) {}

    /**
     * 주식현재가 시세
     * @param marketDivCode
     * @param iscd 종목코드의 shortCode. 예) 삼성전자: 005930
     */
    public async inquirePrice<R = DomesticStockQuotationInquirePrice2Output>(
        marketDivCode: MarketDivCode,
        iscd: string,
    ): Promise<R> {
        const headers = await this.helper.buildHeaders('FHPST01010000');

        const response = await this.helper.request<null, BaseResponse<R>>({
            method: 'GET',
            headers: {
                ...headers,
            },
            url: '/uapi/domestic-stock/v1/quotations/inquire-price-2',
            params: {
                FID_COND_MRKT_DIV_CODE: marketDivCode,
                FID_INPUT_ISCD: iscd,
            },
        });

        return response.output;
    }

    /**
     * 주식현재가 체결
     * @param marketDivCode
     * @param iscd
     */
    public async inquireCcnl<R = DomesticStockQuotationInquireCcnlOutput>(
        marketDivCode: MarketDivCode,
        iscd: string,
    ): Promise<R> {
        const headers = await this.helper.buildHeaders('FHPST01710000');

        const response = await this.helper.request<null, BaseResponse<R>>({
            method: 'GET',
            headers: {
                ...headers,
            },
            url: '/uapi/domestic-stock/v1/quotations/inquire-ccnl',
            params: {
                FID_COND_MRKT_DIV_CODE: marketDivCode,
                FID_INPUT_ISCD: iscd,
            },
        });

        return response.output;
    }

    /**
     * 국내업종 현재지수
     * @param iscd 업종 코드 (idxcode.json)
     */
    public async inquireIndexPrice<
        R = DomesticStockQuotationInquireIndexPriceOutput,
    >(iscd: string): Promise<R> {
        const headers = await this.helper.buildHeaders('FHPUP02100000');

        const response = await this.helper.request<null, BaseResponse<R>>({
            method: 'GET',
            headers: {
                ...headers,
            },
            url: '/uapi/domestic-stock/v1/quotations/inquire-index-price',
            params: {
                FID_COND_MRKT_DIV_CODE: 'U',
                FID_INPUT_ISCD: iscd,
            },
        });

        return response.output;
    }
}
