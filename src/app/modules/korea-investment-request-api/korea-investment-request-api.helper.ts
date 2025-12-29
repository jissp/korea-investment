import { Job } from 'bullmq';
import { FlowChildJob } from 'bullmq/dist/esm/interfaces/flow-job';
import { Injectable } from '@nestjs/common';
import {
    DomesticStockQuotationsIntstockMultPriceParam,
    DomesticStockQuotationsNewsTitleParam,
} from '@modules/korea-investment/korea-investment-quotation-client';
import {
    KoreaInvestmentCallApiMultiResult,
    KoreaInvestmentCallApiParam,
    KoreaInvestmentCallApiResult,
    KoreaInvestmentRequestApiType,
} from './korea-investment-request-api.type';
import {
    DomesticInvestorTradeByStockDailyParam,
    DomesticInvestorTrendEstimateParam,
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
     * @param url
     * @param tradeId
     * @param params
     * @param opts
     */
    public generateRequestApi<Params>(
        { url, tradeId, params }: KoreaInvestmentCallApiParam<Params>,
        opts?: FlowChildJob['opts'],
    ): FlowChildJob {
        return {
            name: KoreaInvestmentRequestApiType,
            queueName: KoreaInvestmentRequestApiType,
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
        return this.generateRequestApi<any>({
            url: '/uapi/domestic-stock/v1/quotations/search-stock-info',
            tradeId: 'CTPF1002R',
            params,
        });
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
        return this.generateRequestApi<DomesticProgramTradeTodayParam>({
            url: '/uapi/domestic-stock/v1/quotations/investor-program-trade-today',
            tradeId: 'HHPPG046600C1',
            params,
        });
    }

    /**
     * 종목별 투자자매매동향(일별)
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/investor-trade-by-stock-daily
     */
    public generateDomesticInvestorTradeByStockDaily(
        params: DomesticInvestorTradeByStockDailyParam,
    ) {
        return this.generateRequestApi<DomesticInvestorTradeByStockDailyParam>({
            url: '/uapi/domestic-stock/v1/quotations/investor-trade-by-stock-daily',
            tradeId: 'FHPTJ04160001',
            params,
        });
    }

    /**
     * 종목별 외인기관 추정가집계
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/investor-trend-estimate
     */
    public generateDomesticInvestorTrendEstimate(
        params: DomesticInvestorTrendEstimateParam,
    ) {
        return this.generateRequestApi<DomesticInvestorTrendEstimateParam>({
            url: '/uapi/domestic-stock/v1/quotations/investor-trend-estimate',
            tradeId: 'HHPTJ04160200',
            params,
        });
    }

    /**
     * 관심종목 그룹조회
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/intstock-grouplist
     */
    public generateInterestGroupList(
        params: KoreaInvestmentInterestGroupListParam,
    ) {
        return this.generateRequestApi<KoreaInvestmentInterestGroupListParam>({
            url: '/uapi/domestic-stock/v1/quotations/intstock-grouplist',
            tradeId: 'HHKCM113004C7',
            params,
        });
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
            {
                url: '/uapi/domestic-stock/v1/quotations/intstock-stocklist-by-group',
                tradeId: 'HHKCM113004C6',
                params,
            },
        );
    }

    /**
     * 관심종목(멀티종목) 시세조회
     * @param iscdList
     */
    public generateRequestApiForIntstockMultiPrice(iscdList: string[]) {
        if (iscdList.length > this.MULTI_PRICE_MAX_STOCK_CODES) {
            throw new Error(
                `Stock code list exceeds maximum limit (${this.MULTI_PRICE_MAX_STOCK_CODES})`,
            );
        }

        return this.generateRequestApi<DomesticStockQuotationsIntstockMultPriceParam>(
            {
                url: '/uapi/domestic-stock/v1/quotations/intstock-multprice',
                tradeId: 'FHKST11300006',
                params: this.buildIntstockMultiPriceParam(iscdList),
            },
        );
    }

    /**
     * @param iscdList
     */
    public buildIntstockMultiPriceParam(
        iscdList: string[],
    ): DomesticStockQuotationsIntstockMultPriceParam {
        const params: DomesticStockQuotationsIntstockMultPriceParam = {
            FID_COND_MRKT_DIV_CODE_1: 'UN',
            FID_INPUT_ISCD_1: '',
        };

        iscdList.forEach((iscd, index) => {
            const indexKey = index + 1;
            const marketDivCodeKey =
                `FID_COND_MRKT_DIV_CODE_${indexKey}` as keyof DomesticStockQuotationsIntstockMultPriceParam;
            const inputIscdKey =
                `FID_INPUT_ISCD_${indexKey}` as keyof DomesticStockQuotationsIntstockMultPriceParam;

            params[marketDivCodeKey] = 'UN';
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

        return Object.values(childrenValues).map((v) => v.response);
    }

    /**
     * @param job
     */
    public async getChildMultiResponses<
        Params,
        Response,
        Response2 = unknown | null,
    >(job: Job) {
        const childrenValues =
            await job.getChildrenValues<
                KoreaInvestmentCallApiMultiResult<Params, Response, Response2>
            >();

        return Object.values(childrenValues);
    }
}
