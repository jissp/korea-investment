import { Injectable } from '@nestjs/common';
import { toDateTimeByDate, toDateYmdByDate } from '@common/utils';
import {
    BaseMultiResponse,
    BaseResponse,
    MarketDivCode,
} from '@modules/korea-investment/common';
import { KoreaInvestmentHelperService } from '@modules/korea-investment/korea-investment-helper';
import {
    DomesticStockInquireDailyIndexChartPriceOutput1,
    DomesticStockInquireDailyIndexChartPriceOutput2,
    DomesticStockInquireDailyIndexChartPriceParam,
    DomesticStockInquireDailyPriceOutput,
    DomesticStockInquireDailyPriceParam,
    DomesticStockInquireIndexCategoryPriceOutput1,
    DomesticStockInquireIndexCategoryPriceOutput2,
    DomesticStockInquireIndexCategoryPriceParam,
    DomesticStockInvestorTrendEstimateOutput2,
    DomesticStockInvestorTrendEstimateParam,
    DomesticStockQuotationInquireCcnlOutput,
    DomesticStockQuotationInquireIndexPriceOutput,
    DomesticStockQuotationInquirePrice2Output,
    DomesticStockQuotationsInquireDailyItemChartPriceOutput,
    DomesticStockQuotationsInquireDailyItemChartPriceOutput2,
    DomesticStockQuotationsInquireDailyItemChartPriceParam,
    DomesticStockQuotationsInquireIndexDailyPriceOutput,
    DomesticStockQuotationsInquireIndexDailyPriceOutput2,
    DomesticStockQuotationsInquireIndexDailyPriceParam,
    DomesticStockQuotationsInquireIndexTimePriceOutput,
    DomesticStockQuotationsInquireInvestorOutput,
    DomesticStockQuotationsInquireInvestorParam,
    DomesticStockQuotationsInquireMemberOutput,
    DomesticStockQuotationsInquireMemberParam,
    DomesticStockQuotationsInquireTimeItemChartPriceOutput,
    DomesticStockQuotationsInquireTimeItemChartPriceOutput2,
    DomesticStockQuotationsIntstockMultPriceOutput,
    DomesticStockQuotationsIntstockMultPriceParam,
    DomesticStockQuotationsNewsTitleOutput,
    DomesticStockQuotationsNewsTitleParam,
    DomesticStockSearchInfoOutput,
    DomesticStockSearchInfoParam,
    DomesticStockSearchStockInfoOutput,
    DomesticStockSearchStockInfoParam,
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
     * @param stockCode 종목코드의 shortCode. 예) 삼성전자: 005930
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/inquire-price-2
     */
    public async inquirePrice(marketDivCode: MarketDivCode, stockCode: string) {
        const response = await this.makeQuotationRequest<
            BaseResponse<DomesticStockQuotationInquirePrice2Output>
        >({
            tradeId: 'FHPST01010000',
            url: '/uapi/domestic-stock/v1/quotations/inquire-price-2',
            params: {
                FID_COND_MRKT_DIV_CODE: marketDivCode,
                FID_INPUT_ISCD: stockCode,
            },
        });

        return response.output;
    }

    /**
     * 주식현재가 일자별
     * @param params
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/inquire-daily-price
     */
    public async inquireDailyPrice(
        params: DomesticStockInquireDailyPriceParam,
    ) {
        const response = await this.makeQuotationRequest<
            BaseResponse<DomesticStockInquireDailyPriceOutput[]>
        >({
            tradeId: 'FHKST01010400',
            url: '/uapi/domestic-stock/v1/quotations/inquire-daily-price',
            params,
        });

        return {
            output: response.output,
        };
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
            BaseResponse<DomesticStockQuotationInquireCcnlOutput[]>
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
    public async inquireTimeItemChartPrice(
        marketDiveCode: MarketDivCode,
        stockCode: string,
        date: Date,
        isIncludeOldData: boolean = false,
    ) {
        const hourParam = toDateTimeByDate({ date });

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
                FID_INPUT_ISCD: stockCode,
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
    public async inquireTimeDailyChartPrice(
        marketDivCode: MarketDivCode,
        iscd: string,
        date: Date,
        isIncludeOldData: boolean = false,
    ) {
        const dateParam = toDateYmdByDate({
            date,
        });
        const hourParam = toDateTimeByDate({
            date,
        });

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
    public async inquireIndexTimePrice(
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
     * 주식현재가 투자자 동향
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/inquire-investor
     */
    public async inquireInvestor(
        params: DomesticStockQuotationsInquireInvestorParam,
    ) {
        const response = await this.makeQuotationRequest<
            BaseResponse<DomesticStockQuotationsInquireInvestorOutput[]>
        >({
            tradeId: 'FHKST01010900',
            url: '/uapi/domestic-stock/v1/quotations/inquire-investor',
            params,
        });

        return response.output;
    }

    /**
     * 종목별 외국계 순매수추이
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/investor-trend-estimate
     */
    public async inquireInvestorByEstimate(
        params: DomesticStockInvestorTrendEstimateParam,
    ) {
        const response = await this.makeQuotationRequest<
            BaseMultiResponse<
                unknown,
                DomesticStockInvestorTrendEstimateOutput2[]
            >
        >({
            tradeId: 'HHPTJ04160200',
            url: '/uapi/domestic-stock/v1/quotations/investor-trend-estimate',
            params,
        });

        return response.output2;
    }

    /**
     * 주식현재가 회원사
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/inquire-member
     */
    public async inquireMember(
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
    public async inquireIndexDailyPrice(
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
    public async inquireNewsTitle(
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
     * 관심종목(멀티종목) 시세조회
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/intstock-multprice
     */
    public async inquireIntstockMultiPrice(
        params: DomesticStockQuotationsIntstockMultPriceParam,
    ): Promise<DomesticStockQuotationsIntstockMultPriceOutput[]> {
        const response = await this.makeQuotationRequest<
            BaseResponse<DomesticStockQuotationsIntstockMultPriceOutput[]>
        >({
            tradeId: 'FHKST11300006',
            url: '/uapi/domestic-stock/v1/quotations/intstock-multprice',
            params,
        });

        return response.output;
    }

    /**
     * 국내주식기간별시세(일/주/월/년)
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice
     */
    public async inquireDailyItemChartPrice(
        params: DomesticStockQuotationsInquireDailyItemChartPriceParam,
    ) {
        const response = await this.makeQuotationRequest<
            BaseMultiResponse<
                DomesticStockQuotationsInquireDailyItemChartPriceOutput,
                DomesticStockQuotationsInquireDailyItemChartPriceOutput2[]
            >
        >({
            tradeId: 'FHKST03010100',
            url: '/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice',
            params,
        });

        return {
            output: response.output1,
            output2: response.output2,
        };
    }

    /**
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/inquire-index-category-price
     */
    public async inquireIndexPriceByCategory(
        params: Omit<
            DomesticStockInquireIndexCategoryPriceParam,
            'FID_COND_MRKT_DIV_CODE' | 'FID_COND_SCR_DIV_CODE'
        >,
    ) {
        const response = await this.makeQuotationRequest<
            BaseMultiResponse<
                DomesticStockInquireIndexCategoryPriceOutput1,
                DomesticStockInquireIndexCategoryPriceOutput2
            >
        >({
            tradeId: 'FHPUP02140000',
            url: '/uapi/domestic-stock/v1/quotations/inquire-index-category-price',
            params: {
                ...params,
                FID_COND_MRKT_DIV_CODE: 'U',
                FID_COND_SCR_DIV_CODE: '20214',
            },
        });

        return {
            output: response.output1,
            output2: response.output2,
        };
    }

    /**
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/frgnmem-pchs-trend
     */
    public async inquireRgnmemPchsTrend(params: {
        FID_INPUT_ISCD: string; //	조건시장분류코드	String	Y	12	종목코드(ex) 005930(삼성전자))
        FID_INPUT_ISCD_2?: string; //	조건화면분류코드	String	Y	8	외국계 전체(99999)
        FID_COND_MRKT_DIV_CODE?: string; //	시장구분코드	String	Y	10	J (KRX만 지원)
    }) {
        const response = await this.makeQuotationRequest<
            BaseResponse<{
                bsop_hour: string;
                stck_prpr: string;
                prdy_vrss: string;
                prdy_vrss_sign: string;
                prdy_ctrt: string;
                acml_vol: string;
                frgn_seln_vol: string;
                frgn_shnu_vol: string;
                glob_ntby_qty: string;
                frgn_ntby_qty_icdc: string;
            }>
        >({
            tradeId: 'FHKST644400C0',
            url: '/uapi/domestic-stock/v1/quotations/frgnmem-pchs-trend',
            params: {
                FID_INPUT_ISCD: params.FID_INPUT_ISCD,
                FID_INPUT_ISCD_2: params.FID_INPUT_ISCD_2 ?? '99999',
                FID_COND_MRKT_DIV_CODE: params.FID_COND_MRKT_DIV_CODE ?? 'J',
            },
        });

        return {
            output: response.output,
        };
    }

    /**
     * 주식기본조회
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/search-stock-info
     */
    public async inquireSearchStockInfo(
        params: DomesticStockSearchStockInfoParam,
    ) {
        const response = await this.makeQuotationRequest<
            BaseResponse<DomesticStockSearchStockInfoOutput[]>
        >({
            tradeId: 'CTPF1002R',
            url: '/uapi/domestic-stock/v1/quotations/search-stock-info',
            params,
        });

        return {
            output: response.output,
        };
    }

    /**
     * 상품기본조회
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/search-info
     */
    public async inquireSearchInfo(params: DomesticStockSearchInfoParam) {
        const response = await this.makeQuotationRequest<
            BaseResponse<DomesticStockSearchInfoOutput[]>
        >({
            tradeId: 'CTPF1604R',
            url: '/uapi/domestic-stock/v1/quotations/search-info',
            params,
        });

        return {
            output: response.output,
        };
    }

    /**
     * 국내주식업종기간별시세(일/주/월/년)
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/inquire-daily-indexchartprice
     */
    public async inquireDailyIndexChartPrice(
        params: Omit<
            DomesticStockInquireDailyIndexChartPriceParam,
            'FID_COND_MRKT_DIV_CODE'
        >,
    ) {
        const response = await this.makeQuotationRequest<
            BaseMultiResponse<
                DomesticStockInquireDailyIndexChartPriceOutput1,
                DomesticStockInquireDailyIndexChartPriceOutput2[]
            >
        >({
            tradeId: 'FHKUP03500100',
            url: '/uapi/domestic-stock/v1/quotations/inquire-daily-indexchartprice',
            params: {
                ...params,
                FID_COND_MRKT_DIV_CODE: 'U',
            } as DomesticStockInquireDailyIndexChartPriceParam,
        });

        return {
            output: response.output1,
            output2: response.output2,
        };
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
