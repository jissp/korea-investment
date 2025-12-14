import { ApiProperty } from '@nestjs/swagger';
import { DomesticStockRankingShortSaleOutput } from '@modules/korea-investment/korea-investment-rank-client';

class DomesticStockRankingShortSale implements DomesticStockRankingShortSaleOutput {
    @ApiProperty({
        type: String,
        description: '유가증권 단축 종목코드',
    })
    mksc_shrn_iscd: string;

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
        description: '누적 거래 대금',
    })
    acml_tr_pbmn: string;

    @ApiProperty({
        type: String,
        description: '공매도 체결 수량',
    })
    ssts_cntg_qty: string;

    @ApiProperty({
        type: String,
        description: '공매도 거래량 비중',
    })
    ssts_vol_rlim: string;

    @ApiProperty({
        type: String,
        description: '공매도 거래 대금',
    })
    ssts_tr_pbmn: string;

    @ApiProperty({
        type: String,
        description: '공매도 거래대금 비중',
    })
    ssts_tr_pbmn_rlim: string;

    @ApiProperty({
        type: String,
        description: '기준 일자1',
    })
    stnd_date1: string;

    @ApiProperty({
        type: String,
        description: '기준 일자2',
    })
    stnd_date2: string;

    @ApiProperty({
        type: String,
        description: '평균가격',
    })
    avrg_prc: string;
}

export class DomesticStockRankingShortSaleResponse {
    @ApiProperty({
        type: DomesticStockRankingShortSale,
        isArray: true,
    })
    data: DomesticStockRankingShortSale[];
}
