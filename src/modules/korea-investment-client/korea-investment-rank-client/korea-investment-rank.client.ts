import { Injectable } from '@nestjs/common';
import { KoreaInvestmentHelperService } from '@modules/korea-investment-client/korea-investment-helper';
import {
    BaseResponse,
    DomesticStockQuotationVolumeRankOutput,
    DomesticStockQuotationVolumeRankParam,
    DomesticStockRankingFluctuationOutput,
    DomesticStockRankingFluctuationParam,
} from './korea-investment-rank-client.types';

@Injectable()
export class KoreaInvestmentRankClient {
    constructor(private readonly helper: KoreaInvestmentHelperService) {}

    /**
     * 거래량순위
     * @param params
     */
    public async inquireVolumeRank<
        R = DomesticStockQuotationVolumeRankOutput[],
    >(params: DomesticStockQuotationVolumeRankParam): Promise<R> {
        const headers = await this.helper.buildHeaders('FHPST01710000');

        const response = await this.helper.request<null, BaseResponse<R>>({
            method: 'GET',
            headers: {
                ...headers,
            },
            url: '/uapi/domestic-stock/v1/quotations/volume-rank',
            params: {
                FID_COND_MRKT_DIV_CODE: params.FID_COND_MRKT_DIV_CODE,
                FID_COND_SCR_DIV_CODE: params.FID_COND_SCR_DIV_CODE || '20171',
                FID_INPUT_ISCD: params.FID_INPUT_ISCD || '0000',
                FID_DIV_CLS_CODE: params.FID_DIV_CLS_CODE || '0',
                FID_BLNG_CLS_CODE: params.FID_BLNG_CLS_CODE,
                FID_TRGT_CLS_CODE: params.FID_TRGT_CLS_CODE,
                FID_TRGT_EXLS_CLS_CODE: params.FID_TRGT_EXLS_CLS_CODE,
                FID_INPUT_PRICE_1: params.FID_INPUT_PRICE_1 || '',
                FID_INPUT_PRICE_2: params.FID_INPUT_PRICE_2 || '',
                FID_VOL_CNT: params.FID_VOL_CNT || '',
                FID_INPUT_DATE_1: params.FID_INPUT_DATE_1 || '',
            } as DomesticStockQuotationVolumeRankParam,
        });

        return response.output;
    }

    /**
     * 국내주식 등락률 순위
     * @param params
     */
    public async getFluctuation<R = DomesticStockRankingFluctuationOutput[]>(
        params: DomesticStockRankingFluctuationParam,
    ): Promise<R> {
        const headers = await this.helper.buildHeaders('FHPST01700000');

        const response = await this.helper.request<null, BaseResponse<R>>({
            method: 'GET',
            headers: {
                ...headers,
            },
            url: '/uapi/domestic-stock/v1/ranking/fluctuation',
            params: {
                fid_cond_mrkt_div_code: params.fid_cond_mrkt_div_code,
                fid_cond_scr_div_code: params.fid_cond_scr_div_code || '20171',
                fid_input_iscd: params.fid_input_iscd || '0000',
                fid_div_cls_code: params.fid_div_cls_code || '0',
                fid_input_cnt_1: params.fid_input_cnt_1 || '0',
                fid_trgt_cls_code: params.fid_trgt_cls_code || '0',
                fid_trgt_exls_cls_code: params.fid_trgt_exls_cls_code || '0',
                fid_input_price_1: params.fid_input_price_1 || '',
                fid_input_price_2: params.fid_input_price_2 || '',
                fid_vol_cnt: params.fid_vol_cnt || '',
                fid_rank_sort_cls_code: params.fid_rank_sort_cls_code,
                fid_prc_cls_code: params.fid_prc_cls_code,
                fid_rsfl_rate1: '',
                fid_rsfl_rate2: '',
            } as DomesticStockRankingFluctuationParam,
        });

        return response.output;
    }
}
