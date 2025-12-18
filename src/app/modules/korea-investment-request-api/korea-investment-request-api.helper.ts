import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { DomesticStockQuotationsIntstockMultPriceParam } from '@modules/korea-investment/korea-investment-quotation-client';
import {
    KoreaInvestmentCallApiMultiResult,
    KoreaInvestmentCallApiParam,
    KoreaInvestmentCallApiResult,
    KoreaInvestmentRequestApiType,
} from './korea-investment-request-api.type';

@Injectable()
export class KoreaInvestmentRequestApiHelper {
    private readonly MULTI_PRICE_MAX_STOCK_CODES = 30;

    /**
     * @param url
     * @param tradeId
     * @param params
     */
    public generateRequestApi<Params>({
        url,
        tradeId,
        params,
    }: KoreaInvestmentCallApiParam<Params>) {
        return {
            name: KoreaInvestmentRequestApiType,
            queueName: KoreaInvestmentRequestApiType,
            data: {
                url,
                tradeId,
                params,
            },
        };
    }

    /**
     * @param iscdList
     */
    public generateRequestApiForIntstockMultiPrice(iscdList: string[]) {
        if (iscdList.length > this.MULTI_PRICE_MAX_STOCK_CODES) {
            throw new Error(
                `Stock code list exceeds maximum limit (${this.MULTI_PRICE_MAX_STOCK_CODES})`,
            );
        }

        return {
            name: KoreaInvestmentRequestApiType,
            queueName: KoreaInvestmentRequestApiType,
            data: {
                url: '/uapi/domestic-stock/v1/quotations/intstock-multprice',
                tradeId: 'FHKST11300006',
                params: this.buildIntstockMultiPriceParam(iscdList),
            } as KoreaInvestmentCallApiParam<DomesticStockQuotationsIntstockMultPriceParam>,
        };
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
    public async getChildMultiResponses<Params, Response, Response2 = any>(
        job: Job,
    ) {
        const childrenValues =
            await job.getChildrenValues<
                KoreaInvestmentCallApiMultiResult<Params, Response, Response2>
            >();

        return Object.values(childrenValues).map((v) => v.response);
    }
}
