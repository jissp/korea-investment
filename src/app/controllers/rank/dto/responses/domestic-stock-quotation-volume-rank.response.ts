import { ApiProperty } from '@nestjs/swagger';
import { DomesticStockQuotationVolumeRankOutput } from '@modules/korea-investment/korea-investment-client/korea-investment-rank-client';

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

export class DomesticStockQuotationVolumeRankResponse {
    @ApiProperty({
        type: DomesticStockQuotationVolumeRank,
        isArray: true,
    })
    data: DomesticStockQuotationVolumeRank[];
}
