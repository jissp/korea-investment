import { Injectable } from '@nestjs/common';
import {
    BaseMultiResponse,
    BaseResponse,
    MarketDivCode,
} from '@modules/korea-investment/common';
import { KoreaInvestmentHelperService } from '@modules/korea-investment/korea-investment-helper';
import {
    DomesticStockQuotationInquireCcnlOutput,
    DomesticStockQuotationInquireIndexPriceOutput,
    DomesticStockQuotationInquirePrice2Output,
    DomesticStockQuotationsInquireIndexDailyPriceOutput,
    DomesticStockQuotationsInquireIndexDailyPriceOutput2,
    DomesticStockQuotationsInquireIndexDailyPriceParam,
    DomesticStockQuotationsInquireIndexTimePriceOutput,
    DomesticStockQuotationsInquireMemberOutput,
    DomesticStockQuotationsInquireMemberParam,
    DomesticStockQuotationsInquireTimeItemChartPriceOutput,
    DomesticStockQuotationsInquireTimeItemChartPriceOutput2,
    DomesticStockQuotationsNewsTitleOutput,
    DomesticStockQuotationsNewsTitleParam,
} from './korea-investment-quotation-client.types';

interface QuotationRequestConfig {
    tradeId: string;
    url: string;
    params: Record<string, any>;
}

@Injectable()
export class KoreaInvestmentQuotationClient {
    constructor(private readonly helper: KoreaInvestmentHelperService) {}

    /**
     * 주식현재가 시세
     * @param marketDivCode
     * @param iscd 종목코드의 shortCode. 예) 삼성전자: 005930
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/inquire-price-2
     */
    public async inquirePrice(marketDivCode: MarketDivCode, iscd: string) {
        const response = await this.makeQuotationRequest<
            BaseResponse<DomesticStockQuotationInquirePrice2Output>
        >({
            tradeId: 'FHPST01010000',
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
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/inquire-ccnl
     */
    public async inquireCcnl(marketDivCode: MarketDivCode, iscd: string) {
        const response = await this.makeQuotationRequest<
            BaseResponse<DomesticStockQuotationInquireCcnlOutput>
        >({
            tradeId: 'FHKST01010300',
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
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/inquire-index-price
     */
    public async inquireIndexPrice(iscd: string) {
        const response = await this.makeQuotationRequest<
            BaseResponse<DomesticStockQuotationInquireIndexPriceOutput>
        >({
            tradeId: 'FHPUP02100000',
            url: '/uapi/domestic-stock/v1/quotations/inquire-index-price',
            params: {
                FID_COND_MRKT_DIV_CODE: 'U',
                FID_INPUT_ISCD: iscd,
            },
        });

        return response.output;
    }

    /**
     * 주식당일분봉조회
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/inquire-time-itemchartprice
     */
    public async inQuireTimeItemChartPrice(
        marketDiveCode: MarketDivCode,
        iscd: string,
        date: Date,
        isIncludeOldData: boolean = false,
    ) {
        const hourParam = this.helper.formatTimeParam(date);

        const response = await this.makeQuotationRequest<
            BaseMultiResponse<
                DomesticStockQuotationsInquireTimeItemChartPriceOutput,
                DomesticStockQuotationsInquireTimeItemChartPriceOutput2[]
            >
        >({
            tradeId: 'FHKST03010200',
            url: '/uapi/domestic-stock/v1/quotations/inquire-time-itemchartprice',
            params: {
                FID_COND_MRKT_DIV_CODE: marketDiveCode,
                FID_INPUT_ISCD: iscd,
                FID_INPUT_HOUR_1: hourParam,
                FID_PW_DATA_INCU_YN: isIncludeOldData ? 'Y' : 'N',
                FID_ETC_CLS_CODE: '',
            },
        });

        return {
            output: response.output1,
            output2: response.output2,
        };
    }

    /**
     * 주식일별분봉조회
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/inquire-time-dailychartprice
     */
    public async inQuireTimeDailyChartPrice(
        marketDivCode: MarketDivCode,
        iscd: string,
        date: Date,
        isIncludeOldData: boolean = false,
    ) {
        const dateParam = this.helper.formatDateParam(date);
        const hourParam = this.helper.formatTimeParam(date);

        const response = await this.makeQuotationRequest<
            BaseMultiResponse<
                DomesticStockQuotationsInquireTimeItemChartPriceOutput,
                DomesticStockQuotationsInquireTimeItemChartPriceOutput2
            >
        >({
            tradeId: 'FHKST03010230',
            url: '/uapi/domestic-stock/v1/quotations/inquire-time-itemchartprice',
            params: {
                FID_COND_MRKT_DIV_CODE: marketDivCode,
                FID_INPUT_ISCD: iscd,
                FID_INPUT_DATE_1: dateParam,
                FID_INPUT_HOUR_1: hourParam,
                FID_PW_DATA_INCU_YN: isIncludeOldData ? 'Y' : 'N',
                FID_FAKE_TICK_INCU_YN: '',
            },
        });

        return {
            output: response.output1,
            output2: response.output2,
        };
    }

    /**
     * 국내업종 시간별지수
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/inquire-index-timeprice
     */
    public async inQuireIndexTimePrice(
        iscd: '0001' | '1001' | '2001' | '3003',
        timeframe: '1' | '5' | '15' | '30' | '60' | '300' | '600',
    ) {
        const response = await this.makeQuotationRequest<
            BaseResponse<DomesticStockQuotationsInquireIndexTimePriceOutput[]>
        >({
            tradeId: 'FHPUP02110200',
            url: '/uapi/domestic-stock/v1/quotations/inquire-index-timeprice',
            params: {
                FID_COND_MRKT_DIV_CODE: 'U',
                FID_INPUT_ISCD: iscd,
                FID_INPUT_HOUR_1: timeframe,
            },
        });

        return response.output;
    }

    /**
     * 주식현재가 회원사
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/inquire-member
     */
    public async inQuireMember(
        params: DomesticStockQuotationsInquireMemberParam,
    ) {
        const response = await this.makeQuotationRequest<
            BaseResponse<DomesticStockQuotationsInquireMemberOutput[]>
        >({
            tradeId: 'FHKST01010600',
            url: '/uapi/domestic-stock/v1/quotations/inquire-member',
            params,
        });

        return response.output;
    }

    /**
     * 국내업종 시간별지수
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/inquire-index-daily-price
     */
    public async inQuireIndexDailyPrice(
        params: DomesticStockQuotationsInquireIndexDailyPriceParam,
    ) {
        const response = await this.makeQuotationRequest<
            BaseMultiResponse<
                DomesticStockQuotationsInquireIndexDailyPriceOutput,
                DomesticStockQuotationsInquireIndexDailyPriceOutput2[]
            >
        >({
            tradeId: 'FHPUP02120000',
            url: '/uapi/domestic-stock/v1/quotations/inquire-index-daily-price',
            params,
        });

        return {
            output: response.output1,
            output2: response.output2,
        };
    }

    /**
     * 종합 시황/공시(제목)
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/news-title
     */
    public async inQuireNewsTitle(
        params: DomesticStockQuotationsNewsTitleParam,
    ) {
        const response = await this.makeQuotationRequest<
            BaseResponse<DomesticStockQuotationsNewsTitleOutput[]>
        >({
            tradeId: 'FHKST01011800',
            url: '/uapi/domestic-stock/v1/quotations/news-title',
            params,
        });

        return response.output;
    }

    /**
     * 공통 시세 조회 요청 처리
     * @private
     */
    private async makeQuotationRequest<R>(
        config: QuotationRequestConfig,
    ): Promise<R> {
        const headers = await this.helper.buildHeaders(config.tradeId);

        return this.helper.request<null, R>({
            method: 'GET',
            headers,
            url: config.url,
            params: config.params,
        });
    }
}
