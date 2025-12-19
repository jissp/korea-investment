import {
    BaseMultiResponse,
    BaseResponse,
} from '@modules/korea-investment/common';

export const KoreaInvestmentRequestApiType = 'KoreaInvestmentRequestApi';

export interface KoreaInvestmentCallApiParam<T = any> {
    url: string;
    tradeId: string;
    params: T;
}

export interface KoreaInvestmentCallApiResult<Params = any, Response = any> {
    request: KoreaInvestmentCallApiParam<Params>;
    response: BaseResponse<Response>;
}

export interface KoreaInvestmentCallApiMultiResult<
    Params = any,
    Response = any,
    Response2 = any,
> {
    request: KoreaInvestmentCallApiParam<Params>;
    response: BaseMultiResponse<Response, Response2>;
}
