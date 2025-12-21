import { ApiProperty } from '@nestjs/swagger';
import {
    DomesticStockQuotationsInquireDailyItemChartPriceOutput,
    DomesticStockQuotationsInquireDailyItemChartPriceOutput2,
} from '@modules/korea-investment/korea-investment-quotation-client';
import { Nullable } from '@common/types';

class DomesticStockQuotationsInquireDailyItemChartPrice1 implements DomesticStockQuotationsInquireDailyItemChartPriceOutput {
    @ApiProperty({
        description: '전일 대비',
    })
    prdy_vrss: string;

    @ApiProperty({
        description: '전일 대비 부호',
    })
    prdy_vrss_sign: string;

    @ApiProperty({
        description: '전일 대비율',
    })
    prdy_ctrt: string;

    @ApiProperty({
        description: '주식 전일 종가',
    })
    stck_prdy_clpr: string;

    @ApiProperty({
        description: '누적 거래량',
    })
    acml_vol: string;

    @ApiProperty({
        description: '누적 거래 대금',
    })
    acml_tr_pbmn: string;

    @ApiProperty({
        description: 'HTS 한글 종목명',
    })
    hts_kor_isnm: string;

    @ApiProperty({
        description: '주식 현재가',
    })
    stck_prpr: string;

    @ApiProperty({
        description: '주식 단축 종목코드',
    })
    stck_shrn_iscd: string;

    @ApiProperty({
        description: '전일 거래량',
    })
    prdy_vol: string;

    @ApiProperty({
        description: '주식 상한가',
    })
    stck_mxpr: string;

    @ApiProperty({
        description: '주식 하한가',
    })
    stck_llam: string;

    @ApiProperty({
        description: '주식 시가2',
    })
    stck_oprc: string;

    @ApiProperty({
        description: '주식 최고가',
    })
    stck_hgpr: string;

    @ApiProperty({
        description: '주식 최저가',
    })
    stck_lwpr: string;

    @ApiProperty({
        description: '주식 전일 시가',
    })
    stck_prdy_oprc: string;

    @ApiProperty({
        description: '주식 전일 최고가',
    })
    stck_prdy_hgpr: string;

    @ApiProperty({
        description: '주식 전일 최저가',
    })
    stck_prdy_lwpr: string;

    @ApiProperty({
        description: '매도호가',
    })
    askp: string;

    @ApiProperty({
        description: '매수호가',
    })
    bidp: string;

    @ApiProperty({
        description: '전일 대비 거래량',
    })
    prdy_vrss_vol: string;

    @ApiProperty({
        description: '거래량 회전율',
    })
    vol_tnrt: string;

    @ApiProperty({
        description: '주식 액면가',
    })
    stck_fcam: string;

    @ApiProperty({
        description: '상장 주수',
    })
    lstn_stcn: string;

    @ApiProperty({
        description: '자본금',
    })
    cpfn: string;

    @ApiProperty({
        description: 'HTS 시가총액',
    })
    hts_avls: string;

    @ApiProperty({
        description: 'PER',
    })
    per: string;

    @ApiProperty({
        description: 'EPS',
    })
    eps: string;

    @ApiProperty({
        description: 'PBR',
    })
    pbr: string;

    @ApiProperty({
        description: '전체 융자 잔고 비율',
    })
    itewhol_loan_rmnd_ratem: string;
}

class DomesticStockQuotationsInquireDailyItemChartPrice2 implements DomesticStockQuotationsInquireDailyItemChartPriceOutput2 {
    @ApiProperty({
        description: '주식 영업 일자',
    })
    stck_bsop_date: string;

    @ApiProperty({
        description: '주식 종가',
    })
    stck_clpr: string;

    @ApiProperty({
        description: '주식 시가2',
    })
    stck_oprc: string;

    @ApiProperty({
        description: '주식 최고가',
    })
    stck_hgpr: string;

    @ApiProperty({
        description: '주식 최저가',
    })
    stck_lwpr: string;

    @ApiProperty({
        description: '누적 거래량',
    })
    acml_vol: string;

    @ApiProperty({
        description: '누적 거래 대금',
    })
    acml_tr_pbmn: string;

    @ApiProperty({
        description:
            '락 구분 코드  01 : 권리락  02 : 배당락  03 : 분배락  04 : 권배락  05 : 중간(분기)배당락  06 : 권리중간배당락  07 : 권리분기배당락',
    })
    flng_cls_code: string;

    @ApiProperty({
        description: '분할 비율  기준가/전일 종가',
    })
    prtt_rate: string;

    @ApiProperty({
        description:
            '변경 여부  현재 영업일에 체결이 발생하지 않아 시가가 없을경우 Y 로 표시(차트에서 사용)',
    })
    mod_yn: string;

    @ApiProperty({
        description: '전일 대비 부호',
    })
    prdy_vrss_sign: string;

    @ApiProperty({
        description: '전일 대비',
    })
    prdy_vrss: string;

    @ApiProperty({
        description:
            '재평가사유코드  00:해당없음  01:회사분할  02:자본감소  03:장기간정지  04:초과분배  05:대규모배당  06:회사분할합병  07:ETN증권병합/분할  08:신종증권기세조정  99:기타',
    })
    revl_issu_reas: string;
}

export class KoreaInvestmentDailyItemChartPriceData {
    @ApiProperty({
        type: DomesticStockQuotationsInquireDailyItemChartPrice1,
    })
    data1: DomesticStockQuotationsInquireDailyItemChartPrice1;

    @ApiProperty({
        type: DomesticStockQuotationsInquireDailyItemChartPrice2,
        isArray: true,
    })
    data2: DomesticStockQuotationsInquireDailyItemChartPrice2[];
}

export class KoreaInvestmentDailyItemChartPriceResponse {
    @ApiProperty({
        type: KoreaInvestmentDailyItemChartPriceData,
        nullable: true,
    })
    data: Nullable<KoreaInvestmentDailyItemChartPriceData>;
}
