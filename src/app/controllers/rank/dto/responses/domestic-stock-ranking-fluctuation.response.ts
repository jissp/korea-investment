import { ApiProperty } from '@nestjs/swagger';
import { DomesticStockRankingFluctuationOutput } from '@modules/korea-investment/korea-investment-rank-client';

class DomesticStockRankingFluctuation implements DomesticStockRankingFluctuationOutput {
    @ApiProperty({
        type: String,
        description: '주식 단축 종목코드',
    })
    stck_shrn_iscd: string;

    @ApiProperty({
        type: String,
        description: '데이터 순위',
    })
    data_rank: string;

    @ApiProperty({
        type: String,
        description: 'HTS 한글 종목명',
    })
    hts_kor_isnm: string;

    @ApiProperty({
        type: String,
        description: '주식 현재가',
    })
    stck_prpr: string;

    @ApiProperty({
        type: String,
        description: '전일 대비',
    })
    prdy_vrss: string;

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
        description: '주식 최고가',
    })
    stck_hgpr: string;

    @ApiProperty({
        type: String,
        description: '최고가 시간',
    })
    hgpr_hour: string;

    @ApiProperty({
        type: String,
        description: '누적 최고가 일자',
    })
    acml_hgpr_date: string;

    @ApiProperty({
        type: String,
        description: '주식 최저가',
    })
    stck_lwpr: string;

    @ApiProperty({
        type: String,
        description: '최저가 시간',
    })
    lwpr_hour: string;

    @ApiProperty({
        type: String,
        description: '누적 최저가 일자',
    })
    acml_lwpr_date: string;

    @ApiProperty({
        type: String,
        description: '최저가 대비 현재가 비율',
    })
    lwpr_vrss_prpr_rate: string;

    @ApiProperty({
        type: String,
        description: '지정 일자 종가 대비 현재가 비',
    })
    dsgt_date_clpr_vrss_prpr_rate: string;

    @ApiProperty({
        type: String,
        description: '연속 상승 일수',
    })
    cnnt_ascn_dynu: string;

    @ApiProperty({
        type: String,
        description: '최고가 대비 현재가 비율',
    })
    hgpr_vrss_prpr_rate: string;

    @ApiProperty({
        type: String,
        description: '연속 하락 일수',
    })
    cnnt_down_dynu: string;

    @ApiProperty({
        type: String,
        description: '시가2 대비 현재가 부호',
    })
    oprc_vrss_prpr_sign: string;

    @ApiProperty({
        type: String,
        description: '시가2 대비 현재가',
    })
    oprc_vrss_prpr: string;

    @ApiProperty({
        type: String,
        description: '시가2 대비 현재가 비율',
    })
    oprc_vrss_prpr_rate: string;

    @ApiProperty({
        type: String,
        description: '기간 등락',
    })
    prd_rsfl: string;

    @ApiProperty({
        type: String,
        description: '기간 등락 비율',
    })
    prd_rsfl_rate: string;
}
export class DomesticStockRankingFluctuationResponse {
    @ApiProperty({
        type: DomesticStockRankingFluctuation,
        isArray: true,
    })
    data: DomesticStockRankingFluctuation[];
}
