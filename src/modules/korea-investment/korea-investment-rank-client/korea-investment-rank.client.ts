import { Injectable } from '@nestjs/common';
import {
    BaseMultiResponse,
    BaseResponse,
    DomesticStockQuotationVolumeRankOutput,
    DomesticStockQuotationVolumeRankParam,
    DomesticStockRankingFluctuationOutput,
    DomesticStockRankingFluctuationParam,
    DomesticStockRankingHtsTopViewOutput,
    DomesticStockRankingShortSaleOutput,
    DomesticStockRankingShortSaleParam,
} from '@modules/korea-investment/common';
import { KoreaInvestmentHelperService } from '@modules/korea-investment/korea-investment-helper';

interface RankRequestConfig {
    tradeId: string;
    url: string;
    params?: Record<string, any>;
}

@Injectable()
export class KoreaInvestmentRankClient {
    constructor(private readonly helper: KoreaInvestmentHelperService) {}

    /**
     * 거래량순위
     * @param params
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/quotations/volume-rank
     */
    public async inquireVolumeRank(
        params: DomesticStockQuotationVolumeRankParam,
    ) {
        const response = await this.makeRankRequest<
            BaseResponse<DomesticStockQuotationVolumeRankOutput[]>
        >({
            tradeId: 'FHPST01710000',
            url: '/uapi/domestic-stock/v1/quotations/volume-rank',
            params: this.buildVolumeRankParams(params),
        });

        return response.output;
    }

    /**
     * 국내주식 등락률 순위
     * @param params
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/ranking/fluctuation
     */
    public async inquireFluctuationRank(
        params: DomesticStockRankingFluctuationParam,
    ) {
        const response = await this.makeRankRequest<
            BaseResponse<DomesticStockRankingFluctuationOutput[]>
        >({
            tradeId: 'FHPST01700000',
            url: '/uapi/domestic-stock/v1/ranking/fluctuation',
            params: this.buildFluctuationParams(params),
        });

        return response.output;
    }

    /**
     * HTS조회상위20종목
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/ranking/hts-top-view
     */
    public async getHtsTopList() {
        const response = await this.makeRankRequest<
            BaseMultiResponse<DomesticStockRankingHtsTopViewOutput[]>
        >({
            tradeId: 'HHMCM000100C0',
            url: '/uapi/domestic-stock/v1/ranking/hts-top-view',
        });

        return response.output1;
    }

    /**
     * 국내주식 공매도 상위종목
     *
     * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/ranking/short-sale
     */
    public async getShortSale(params: DomesticStockRankingShortSaleParam) {
        const response = await this.makeRankRequest<
            BaseResponse<DomesticStockRankingShortSaleOutput[]>
        >({
            tradeId: 'FHPST04820000',
            url: '/uapi/domestic-stock/v1/ranking/short-sale',
            params,
        });

        return response.output;
    }

    /**
     * 공통 순위 조회 요청 처리
     * @private
     */
    private async makeRankRequest<R>(config: RankRequestConfig): Promise<R> {
        const headers = await this.helper.buildHeaders(config.tradeId);

        return this.helper.request<null, R>({
            method: 'GET',
            headers,
            url: config.url,
            params: config.params,
        });
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
    ) {
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
