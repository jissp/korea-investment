import { Injectable } from '@nestjs/common';
import { KoreaInvestmentHelperService } from '@modules/korea-investment-client/korea-investment-helper';
import { MarketDivCode } from '@modules/korea-investment-client/common';
import {
    BaseResponse,
    DomesticStockQuotationInquireCcnlOutput,
    DomesticStockQuotationInquireIndexPriceOutput,
    DomesticStockQuotationInquirePrice2Output,
} from './korea-investment-quotation-client.types';

interface QuotationRequestConfig {
    tradeId: string;
    url: string;
    params: Record<string, string>;
}

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
        return this.makeQuotationRequest<R>({
            tradeId: 'FHPST01010000',
            url: '/uapi/domestic-stock/v1/quotations/inquire-price-2',
            params: {
                FID_COND_MRKT_DIV_CODE: marketDivCode,
                FID_INPUT_ISCD: iscd,
            },
        });
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
        return this.makeQuotationRequest<R>({
            tradeId: 'FHPST01710000',
            url: '/uapi/domestic-stock/v1/quotations/inquire-ccnl',
            params: {
                FID_COND_MRKT_DIV_CODE: marketDivCode,
                FID_INPUT_ISCD: iscd,
            },
        });
    }

    /**
     * 국내업종 현재지수
     * @param iscd 업종 코드 (idxcode.json)
     */
    public async inquireIndexPrice<
        R = DomesticStockQuotationInquireIndexPriceOutput,
    >(iscd: string): Promise<R> {
        return this.makeQuotationRequest<R>({
            tradeId: 'FHPUP02100000',
            url: '/uapi/domestic-stock/v1/quotations/inquire-index-price',
            params: {
                FID_COND_MRKT_DIV_CODE: 'U',
                FID_INPUT_ISCD: iscd,
            },
        });
    }

    /**
     * 공통 시세 조회 요청 처리
     * @private
     */
    private async makeQuotationRequest<R>(
        config: QuotationRequestConfig,
    ): Promise<R> {
        const headers = await this.helper.buildHeaders(config.tradeId);
        const response = await this.helper.request<null, BaseResponse<R>>({
            method: 'GET',
            headers,
            url: config.url,
            params: config.params,
        });
        return response.output;
    }
}
