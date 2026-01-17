import { Job } from 'bullmq';
import { FlowChildJob } from 'bullmq/dist/esm/interfaces/flow-job';
import { Injectable } from '@nestjs/common';
import { MarketDivCode } from '@modules/korea-investment/common';
import {
    DomesticStockInvestorTrendEstimateParam,
    DomesticStockQuotationsInquireInvestorParam,
    DomesticStockQuotationsIntstockMultPriceParam,
    DomesticStockQuotationsNewsTitleParam,
} from '@modules/korea-investment/korea-investment-quotation-client';
import { DomesticStockQuotationVolumeRankParam } from '@modules/korea-investment/korea-investment-rank-client';
import {
    KoreaInvestmentCallApiMultiResult,
    KoreaInvestmentCallApiParam,
    KoreaInvestmentCallApiResult,
    KoreaInvestmentRequestApiType,
} from './korea-investment-request-api.type';
import {
    DomesticInvestorTradeByStockDailyParam,
    DomesticProgramTradeTodayParam,
    DomesticSearchStockInfoParam,
    KoreaInvestmentAccountParam,
    KoreaInvestmentAccountStockParam,
    KoreaInvestmentInterestGroupListParam,
    KoreaInvestmentInterestStockListByGroupParam,
} from './korea-investment-request-api.interface';

@Injectable()
export class KoreaInvestmentRequestApiHelper {
    private readonly MULTI_PRICE_MAX_STOCK_CODES = 30;
    private readonly DEFAULT_PRIORITY = 1000;

    /**
     * 한국투자증권 API 호출용 Job Payload 생성
     *
     * @param type
     * @param url
     * @param tradeId
     * @param params
     * @param opts
     */
    public generateRequestApi<Params>(
        type: KoreaInvestmentRequestApiType,
        { url, tradeId, params }: KoreaInvestmentCallApiParam<Params>,
        opts?: FlowChildJob['opts'],
    ): FlowChildJob {
        return {
            name: type,
            queueName: type,
            data: {
                url,
                tradeId,
                params,
            },
            opts: Object.assign(
                {},
                {
                    priority: this.DEFAULT_PRIORITY,
                },
                opts,
            ),
        };
    }

    /**
     * 주식기본조회
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/search-stock-info
     * @param params
     */
    public generateDomesticSearchStockInfo(
        params: DomesticSearchStockInfoParam,
    ) {
        // ETN의 경우, Q로 시작 (EX. Q500001)
        return this.generateRequestApi<any>(
            KoreaInvestmentRequestApiType.Additional,
            {
                url: '/uapi/domestic-stock/v1/quotations/search-stock-info',
                tradeId: 'CTPF1002R',
                params,
            },
        );
    }

    /**
     * 투자계좌자산현황조회
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/trading/inquire-account-balance
     * @param params
     */
    public generateDomesticInquireAccountBalance(
        params: KoreaInvestmentAccountParam,
    ) {
        return this.generateRequestApi<KoreaInvestmentAccountParam>(
            KoreaInvestmentRequestApiType.Main,
            {
                url: '/uapi/domestic-stock/v1/trading/inquire-account-balance',
                tradeId: 'CTRP6548R',
                params,
            },
            {
                priority: 100,
            },
        );
    }

    /**
     * 주식잔고조회
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/trading/inquire-balance
     * @param params
     */
    public generateDomesticInquireBalance(
        params: KoreaInvestmentAccountStockParam,
    ) {
        return this.generateRequestApi<KoreaInvestmentAccountStockParam>(
            KoreaInvestmentRequestApiType.Main,
            {
                url: '/uapi/domestic-stock/v1/trading/inquire-balance',
                tradeId: 'TTTC8434R',
                params,
            },
            {
                priority: 100,
            },
        );
    }

    /**
     * 종합 시황/공시(제목)
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/news-title
     * @param params
     */
    public generateDomesticNewsTitle(
        params: DomesticStockQuotationsNewsTitleParam,
    ) {
        return this.generateRequestApi<DomesticStockQuotationsNewsTitleParam>(
            KoreaInvestmentRequestApiType.Additional,
            {
                url: '/uapi/domestic-stock/v1/quotations/news-title',
                tradeId: 'FHKST01011800',
                params,
            },
            {
                priority: 10000,
            },
        );
    }

    /**
     * 프로그램매매 투자자매매동향(당일)
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/investor-program-trade-today
     */
    public generateDomesticInvestorProgramTradeToday(
        params: DomesticProgramTradeTodayParam,
    ) {
        return this.generateRequestApi<DomesticProgramTradeTodayParam>(
            KoreaInvestmentRequestApiType.Additional,
            {
                url: '/uapi/domestic-stock/v1/quotations/investor-program-trade-today',
                tradeId: 'HHPPG046600C1',
                params,
            },
        );
    }

    /**
     * 주식현재가 투자자
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/inquire-investor
     */
    public generateDomesticInvestor(
        params: DomesticStockQuotationsInquireInvestorParam,
    ) {
        return this.generateRequestApi<DomesticStockQuotationsInquireInvestorParam>(
            KoreaInvestmentRequestApiType.Additional,
            {
                url: '/uapi/domestic-stock/v1/quotations/inquire-investor',
                tradeId: 'FHKST01010900',
                params,
            },
        );
    }

    /**
     * 종목별 투자자매매동향(일별)
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/investor-trade-by-stock-daily
     */
    public generateDomesticInvestorTradeByStockDaily(
        params: DomesticInvestorTradeByStockDailyParam,
    ) {
        return this.generateRequestApi<DomesticInvestorTradeByStockDailyParam>(
            KoreaInvestmentRequestApiType.Additional,
            {
                url: '/uapi/domestic-stock/v1/quotations/investor-trade-by-stock-daily',
                tradeId: 'FHPTJ04160001',
                params,
            },
        );
    }

    /**
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/investor-trend-estimate
     */
    public generateDomesticInvestorByEstimate(
        params: DomesticStockInvestorTrendEstimateParam,
    ) {
        return this.generateRequestApi<DomesticStockInvestorTrendEstimateParam>(
            KoreaInvestmentRequestApiType.Additional,
            {
                tradeId: 'HHPTJ04160200',
                url: '/uapi/domestic-stock/v1/quotations/investor-trend-estimate',
                params,
            },
        );
    }

    /**
     * 관심종목 그룹조회
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/intstock-grouplist
     */
    public generateInterestGroupList(
        params: KoreaInvestmentInterestGroupListParam,
    ) {
        return this.generateRequestApi<KoreaInvestmentInterestGroupListParam>(
            KoreaInvestmentRequestApiType.Main,
            {
                url: '/uapi/domestic-stock/v1/quotations/intstock-grouplist',
                tradeId: 'HHKCM113004C7',
                params,
            },
        );
    }

    /**
     * 관심종목 그룹별 종목조회
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/intstock-stocklist-by-group
     */
    public generateInterestStockListByGroup(
        params: KoreaInvestmentInterestStockListByGroupParam,
    ) {
        return this.generateRequestApi<KoreaInvestmentInterestStockListByGroupParam>(
            KoreaInvestmentRequestApiType.Main,
            {
                url: '/uapi/domestic-stock/v1/quotations/intstock-stocklist-by-group',
                tradeId: 'HHKCM113004C6',
                params,
            },
        );
    }

    /**
     * 거래량순위
     */
    public generateRequestApiForRankingVolume({
        marketDivCode,
    }: {
        marketDivCode: MarketDivCode;
    }) {
        return this.generateRequestApi<DomesticStockQuotationVolumeRankParam>(
            KoreaInvestmentRequestApiType.Additional,
            {
                url: '/uapi/domestic-stock/v1/quotations/volume-rank',
                tradeId: 'FHPST01710000',
                params: {
                    FID_COND_MRKT_DIV_CODE: marketDivCode,
                    FID_COND_SCR_DIV_CODE: '20171',
                    FID_INPUT_ISCD: '0000',
                    FID_DIV_CLS_CODE: '1',
                    FID_BLNG_CLS_CODE: '0',
                    FID_TRGT_CLS_CODE: '000000000',
                    FID_TRGT_EXLS_CLS_CODE: '000000000',
                    FID_INPUT_PRICE_1: '',
                    FID_INPUT_PRICE_2: '',
                    FID_VOL_CNT: '',
                    FID_INPUT_DATE_1: '',
                },
            },
        );
    }

    /**
     * HTS조회상위20종목
     */
    public generateRequestApiForRankingHtsTopView() {
        return this.generateRequestApi<undefined>(
            KoreaInvestmentRequestApiType.Additional,
            {
                url: '/uapi/domestic-stock/v1/ranking/hts-top-view',
                tradeId: 'HHMCM000100C0',
                params: undefined,
            },
        );
    }

    /**
     * 관심종목(멀티종목) 시세조회
     * @param marketDivCode
     * @param iscdList
     */
    public generateRequestApiForIntstockMultiPrice(
        marketDivCode: MarketDivCode,
        iscdList: string[],
    ) {
        if (iscdList.length > this.MULTI_PRICE_MAX_STOCK_CODES) {
            throw new Error(
                `Stock code list exceeds maximum limit (${this.MULTI_PRICE_MAX_STOCK_CODES})`,
            );
        }

        return this.generateRequestApi<DomesticStockQuotationsIntstockMultPriceParam>(
            KoreaInvestmentRequestApiType.Additional,
            {
                url: '/uapi/domestic-stock/v1/quotations/intstock-multprice',
                tradeId: 'FHKST11300006',
                params: this.buildIntstockMultiPriceParam(
                    marketDivCode,
                    iscdList,
                ),
            },
        );
    }

    /**
     * @param marketDivCode
     * @param iscdList
     */
    public buildIntstockMultiPriceParam(
        marketDivCode: MarketDivCode,
        iscdList: string[],
    ): DomesticStockQuotationsIntstockMultPriceParam {
        const params: DomesticStockQuotationsIntstockMultPriceParam = {
            FID_COND_MRKT_DIV_CODE_1: marketDivCode,
            FID_INPUT_ISCD_1: '',
        };

        iscdList.forEach((iscd, index) => {
            const indexKey = index + 1;
            const marketDivCodeKey =
                `FID_COND_MRKT_DIV_CODE_${indexKey}` as keyof DomesticStockQuotationsIntstockMultPriceParam;
            const inputIscdKey =
                `FID_INPUT_ISCD_${indexKey}` as keyof DomesticStockQuotationsIntstockMultPriceParam;

            params[marketDivCodeKey] = marketDivCode;
            params[inputIscdKey] = iscd;
        });

        return params;
    }

    /**
     * @param job
     */
    public async getChildResponses<Params, Response>(job: Job) {
        const childrenValues =
            await job.getChildrenValues<
                KoreaInvestmentCallApiResult<Params, Response>
            >();

        return Object.values(childrenValues);
    }

    /**
     * @param job
     */
    public async getChildMultiResponses<Params, Response, Response2 = unknown>(
        job: Job,
    ) {
        const childrenValues =
            await job.getChildrenValues<
                KoreaInvestmentCallApiMultiResult<Params, Response, Response2>
            >();

        return Object.values(childrenValues);
    }
}
