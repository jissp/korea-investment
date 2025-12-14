import { ApiProperty } from '@nestjs/swagger';
import { DomesticStockQuotationsIntstockMultPriceOutput } from '@modules/korea-investment/korea-investment-quotation-client';
import { KoreaInvestmentPopulatedVolumeRankItem } from '@app/modules/stock-repository';
import { DomesticStockQuotationVolumeRankOutput } from '@modules/korea-investment/korea-investment-rank-client';

class DomesticStockQuotationVolumeRank implements DomesticStockQuotationVolumeRankOutput {
    @ApiProperty({
        type: String,
        description: 'HTS 한글 종목명',
    })
    hts_kor_isnm: string;

    @ApiProperty({
        type: String,
        description: '유가증권 단축 종목코드',
    })
    mksc_shrn_iscd: string;

    @ApiProperty({
        type: String,
        description: '데이터 순위',
    })
    data_rank: string;

    @ApiProperty({
        type: String,
        description: '주식 현재가',
    })
    stck_prpr: string;

    @ApiProperty({
        type: String,
        description: '전일 대비 부호',
    })
    prdy_vrss_sign: string;

    @ApiProperty({
        type: String,
        description: '전일 대비',
    })
    prdy_vrss: string;

    @ApiProperty({
        type: String,
        description: '전일 대비율',
    })
    prdy_ctrt: string;

    @ApiProperty({
        type: String,
        description: '누적 거래량',
    })
    acml_vol: string;

    @ApiProperty({
        type: String,
        description: '전일 거래량',
    })
    prdy_vol: string;

    @ApiProperty({
        type: String,
        description: '상장 주수',
    })
    lstn_stcn: string;

    @ApiProperty({
        type: String,
        description: '평균 거래량',
    })
    avrg_vol: string;

    @ApiProperty({
        type: String,
        description: 'N일전종가대비현재가대비율',
    })
    n_befr_clpr_vrss_prpr_rate: string;

    @ApiProperty({
        type: String,
        description: '거래량증가율',
    })
    vol_inrt: string;

    @ApiProperty({
        type: String,
        description: '거래량 회전율',
    })
    vol_tnrt: string;

    @ApiProperty({
        type: String,
        description: 'N일 거래량 회전율',
    })
    nday_vol_tnrt: string;

    @ApiProperty({
        type: String,
        description: '평균 거래 대금',
    })
    avrg_tr_pbmn: string;

    @ApiProperty({
        type: String,
        description: '거래대금회전율',
    })
    tr_pbmn_tnrt: string;

    @ApiProperty({
        type: String,
        description: 'N일 거래대금 회전율',
    })
    nday_tr_pbmn_tnrt: string;

    @ApiProperty({
        type: String,
        description: '누적 거래 대금',
    })
    acml_tr_pbmn: string;
}

class DomesticStockQuotationsIntstockMultPrice implements DomesticStockQuotationsIntstockMultPriceOutput {
    @ApiProperty({
        type: String,
        description: '코스피 코스닥 구분 명',
    })
    kospi_kosdaq_cls_name: string;

    @ApiProperty({
        type: String,
        description: '시장 조치 구분 명',
    })
    mrkt_trtm_cls_name: string;

    @ApiProperty({
        type: String,
        description: '시간 구분 코드',
    })
    hour_cls_code: string;

    @ApiProperty({
        type: String,
        description: '관심 단축 종목코드',
    })
    inter_shrn_iscd: string;

    @ApiProperty({
        type: String,
        description: '관심 한글 종목명',
    })
    inter_kor_isnm: string;

    @ApiProperty({
        type: String,
        description: '관심2 현재가',
    })
    inter2_prpr: string;

    @ApiProperty({
        type: String,
        description: '관심2 전일 대비',
    })
    inter2_prdy_vrss: string;

    @ApiProperty({
        type: String,
        description: '전일 대비 부호',
    })
    prdy_vrss_sign: string;

    @ApiProperty({
        type: String,
        description: '전일 대비율',
    })
    prdy_ctrt: string;

    @ApiProperty({
        type: String,
        description: '누적 거래량',
    })
    acml_vol: string;

    @ApiProperty({
        type: String,
        description: '관심2 시가',
    })
    inter2_oprc: string;

    @ApiProperty({
        type: String,
        description: '관심2 고가',
    })
    inter2_hgpr: string;

    @ApiProperty({
        type: String,
        description: '관심2 저가',
    })
    inter2_lwpr: string;

    @ApiProperty({
        type: String,
        description: '관심2 하한가',
    })
    inter2_llam: string;

    @ApiProperty({
        type: String,
        description: '관심2 상한가',
    })
    inter2_mxpr: string;

    @ApiProperty({
        type: String,
        description: '관심2 매도호가',
    })
    inter2_askp: string;

    @ApiProperty({
        type: String,
        description: '관심2 매수호가',
    })
    inter2_bidp: string;

    @ApiProperty({
        type: String,
        description: '매도 잔량',
    })
    seln_rsqn: string;

    @ApiProperty({
        type: String,
        description: '매수2 잔량',
    })
    shnu_rsqn: string;

    @ApiProperty({
        type: String,
        description: '총 매도호가 잔량',
    })
    total_askp_rsqn: string;

    @ApiProperty({
        type: String,
        description: '총 매수호가 잔량',
    })
    total_bidp_rsqn: string;

    @ApiProperty({
        type: String,
        description: '누적 거래 대금',
    })
    acml_tr_pbmn: string;

    @ApiProperty({
        type: String,
        description: '관심2 전일 종가',
    })
    inter2_prdy_clpr: string;

    @ApiProperty({
        type: String,
        description: '시가 대비 최고가 비율',
    })
    oprc_vrss_hgpr_rate: string;

    @ApiProperty({
        type: String,
        description: '관심 예상 체결 대비',
    })
    intr_antc_cntg_vrss: string;

    @ApiProperty({
        type: String,
        description: '관심 예상 체결 대비 부호',
    })
    intr_antc_cntg_vrss_sign: string;

    @ApiProperty({
        type: String,
        description: '관심 예상 체결 전일 대비율',
    })
    intr_antc_cntg_prdy_ctrt: string;

    @ApiProperty({
        type: String,
        description: '관심 예상 거래량',
    })
    intr_antc_vol: string;

    @ApiProperty({
        type: String,
        description: '관심2 기준가',
    })
    inter2_sdpr: string;
}

class KoreaInvestmentPopulatedVolumeRank implements KoreaInvestmentPopulatedVolumeRankItem {
    @ApiProperty({
        type: DomesticStockQuotationVolumeRank,
    })
    volumeRank: DomesticStockQuotationVolumeRank;

    @ApiProperty({
        type: DomesticStockQuotationsIntstockMultPrice,
    })
    stockPrice: DomesticStockQuotationsIntstockMultPrice;
}

export class KoreaInvestmentPopulatedVolumeRankResponse {
    @ApiProperty({
        type: KoreaInvestmentPopulatedVolumeRank,
        isArray: true,
    })
    data: KoreaInvestmentPopulatedVolumeRank[];
}
