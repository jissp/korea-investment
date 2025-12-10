import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { KoreaInvestmentRankClient } from '@modules/korea-investment/korea-investment-client/korea-investment-rank-client';
import {
    DomesticStockQuotationVolumeRankQuery,
    DomesticStockQuotationVolumeRankResponse,
    DomesticStockRankingFluctuationQuery,
    DomesticStockRankingFluctuationResponse,
    DomesticStockRankingHtsTopViewResponse,
} from './dto';

@Controller('v1/korea-investment/rank')
export class RankController {
    constructor(private readonly rankClient: KoreaInvestmentRankClient) {}

    @ApiOperation({
        summary: '거래량순위',
    })
    @ApiResponse({
        type: [DomesticStockQuotationVolumeRankResponse],
    })
    @Get('volume-rank')
    public async getVolumeRank(
        @Query() query: DomesticStockQuotationVolumeRankQuery,
    ) {
        return this.rankClient.inquireVolumeRank({
            FID_COND_MRKT_DIV_CODE: query.fidCondMrktDivCode,
            FID_COND_SCR_DIV_CODE: query.fidCondScrDivCode,
            FID_INPUT_ISCD: query.fidInputIscd,
            FID_DIV_CLS_CODE: query.fidDivClsCode,
            FID_BLNG_CLS_CODE: query.fidBlngClsCode,
            FID_TRGT_CLS_CODE: query.fidTrgtClsCode,
            FID_TRGT_EXLS_CLS_CODE: query.fidTrgtExlsClsCode,
            FID_INPUT_PRICE_1: query.fidInputPrice1,
            FID_INPUT_PRICE_2: query.fidInputPrice2,
            FID_VOL_CNT: query.fidVolCnt,
            FID_INPUT_DATE_1: query.fidInputDate1,
        });
    }

    @ApiOperation({
        summary: '국내주식 등락률 순위',
    })
    @ApiResponse({
        type: [DomesticStockRankingFluctuationResponse],
    })
    @Get('fluctuation')
    public async getFluctuationRank(
        @Query() query: DomesticStockRankingFluctuationQuery,
    ) {
        return this.rankClient.inquireFluctuationRank({
            fid_cond_mrkt_div_code: query.fidCondMrktDivCode,
            fid_cond_scr_div_code: query.fidCondScrDivCode,
            fid_input_cnt_1: query.fidInputCnt1,
            fid_input_iscd: query.fidInputIscd,
            fid_input_price_1: query.fidInputPrice1,
            fid_input_price_2: query.fidInputPrice2,
            fid_rsfl_rate1: query.fidRsflRate1,
            fid_rsfl_rate2: query.fidRsflRate2,
            fid_vol_cnt: query.fidVolCnt,
            fid_rank_sort_cls_code: query.fidRankSortClsCode,
            fid_prc_cls_code: query.fidPrcClsCode,
            fid_div_cls_code: query.fidDivClsCode,
            fid_trgt_cls_code: query.fidTrgtClsCode,
            fid_trgt_exls_cls_code: query.fidTrgtExlsClsCode,
        });
    }

    @ApiOperation({
        summary: 'HTS조회상위20종목',
    })
    @ApiResponse({
        type: [DomesticStockRankingHtsTopViewResponse],
    })
    @Get('hts-top-view')
    public async getHtsTopView() {
        return this.rankClient.getHtsTopList();
    }
}
