import { Injectable } from '@nestjs/common';
import { KoreaInvestmentHelperService } from '@modules/korea-investment-client/korea-investment-helper';
import {
    BaseResponse,
    DomesticStockQuotationVolumeRankOutput,
    DomesticStockQuotationVolumeRankParam,
    DomesticStockRankingFluctuationOutput,
    DomesticStockRankingFluctuationParam,
} from './korea-investment-rank-client.types';

interface RankRequestConfig {
    tradeId: string;
    url: string;
    params: Record<string, string>;
}

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
        return this.makeRankRequest<R>({
            tradeId: 'FHPST01710000',
            url: '/uapi/domestic-stock/v1/quotations/volume-rank',
            params: this.buildVolumeRankParams(params),
        });
    }

    /**
     * 국내주식 등락률 순위
     * @param params
     */
    public async inquireFluctuationRank<
        R = DomesticStockRankingFluctuationOutput[],
    >(params: DomesticStockRankingFluctuationParam): Promise<R> {
        return this.makeRankRequest<R>({
            tradeId: 'FHPST01700000',
            url: '/uapi/domestic-stock/v1/ranking/fluctuation',
            params: this.buildFluctuationParams(params),
        });
    }

    /**
     * 공통 순위 조회 요청 처리
     * @private
     */
    private async makeRankRequest<R>(config: RankRequestConfig): Promise<R> {
        const headers = await this.helper.buildHeaders(config.tradeId);
        const response = await this.helper.request<null, BaseResponse<R>>({
            method: 'GET',
            headers,
            url: config.url,
            params: config.params,
        });
        return response.output;
    }

    /**
     * 거래량순위 파라미터 생성
     * @private
     */
    private buildVolumeRankParams(
        params: DomesticStockQuotationVolumeRankParam,
    ): Record<string, string> {
        return {
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
        };
    }

    /**
     * 등락률순위 파라미터 생성
     * @private
     */
    private buildFluctuationParams(
        params: DomesticStockRankingFluctuationParam,
    ): Record<string, string> {
        return {
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
        };
    }
}
