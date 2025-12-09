import { Injectable } from '@nestjs/common';
import { KoreaInvestmentHelperService } from '@modules/korea-investment/korea-investment-helper';
import { MarketDivCode } from '@modules/korea-investment/common';
import {
    BaseMultiResponse,
    BaseResponse,
    DomesticStockQuotationInquireCcnlOutput,
    DomesticStockQuotationInquireIndexPriceOutput,
    DomesticStockQuotationInquirePrice2Output,
    DomesticStockQuotationsInquireIndexTimePrice,
    DomesticStockQuotationsInquireTimeItemChartPriceOutput,
    DomesticStockQuotationsInquireTimeItemChartPriceOutput2,
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
     * 주식당일분봉조회
     */
    public async inQuireTimeItemChartPrice<
        R = BaseMultiResponse<
            DomesticStockQuotationsInquireTimeItemChartPriceOutput,
            DomesticStockQuotationsInquireTimeItemChartPriceOutput2
        >,
    >(
        marketDiveCode: MarketDivCode,
        iscd: string,
        date: Date,
        isIncludeOldData: boolean = false,
    ) {
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return this.makeQuotationRequest<R>({
            tradeId: 'FHKST03010200',
            url: '/uapi/domestic-stock/v1/quotations/inquire-time-itemchartprice',
            params: {
                FID_COND_MRKT_DIV_CODE: marketDiveCode,
                FID_INPUT_ISCD: iscd,
                FID_INPUT_HOUR_1: `${hour}${minute}${seconds}`,
                FID_PW_DATA_INCU_YN: isIncludeOldData ? 'Y' : 'N',
                FID_ETC_CLS_CODE: '',
            },
        });
    }

    /**
     * 주식일별분봉조회
     */
    public async inQuireTimeDailyChartPrice<
        R = BaseMultiResponse<
            DomesticStockQuotationsInquireTimeItemChartPriceOutput,
            DomesticStockQuotationsInquireTimeItemChartPriceOutput2
        >,
    >(
        marketDiveCode: MarketDivCode,
        iscd: string,
        date: Date,
        isIncludeOldData: boolean = false,
    ) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return this.makeQuotationRequest<R>({
            tradeId: 'FHKST03010230',
            url: '/uapi/domestic-stock/v1/quotations/inquire-time-itemchartprice',
            params: {
                FID_COND_MRKT_DIV_CODE: marketDiveCode,
                FID_INPUT_ISCD: iscd,
                FID_INPUT_DATE_1: `${year}${month}${day}`,
                FID_INPUT_HOUR_1: `${hour}${minute}${seconds}`,
                FID_PW_DATA_INCU_YN: isIncludeOldData ? 'Y' : 'N',
                FID_FAKE_TICK_INCU_YN: '',
            },
        });
    }

    /**
     * 국내업종 시간별지수
     */
    public async inQuireIndexTimePrice<
        R = BaseResponse<DomesticStockQuotationsInquireIndexTimePrice>,
    >(
        iscd: '0001' | '1001' | '2001' | '3003',
        timeframe: '1' | '5' | '15' | '30' | '60' | '300' | '600',
    ) {
        return this.makeQuotationRequest<R>({
            tradeId: 'FHPUP02110200',
            url: '/uapi/domestic-stock/v1/quotations/inquire-index-timeprice',
            params: {
                FID_COND_MRKT_DIV_CODE: 'U',
                FID_INPUT_ISCD: iscd,
                FID_INPUT_HOUR_1: timeframe,
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
