import { ApiProperty } from '@nestjs/swagger';
import {
    OverseasQuotationInquireDailyChartPriceOutput,
    OverseasQuotationInquireDailyChartPriceOutput2,
} from '@modules/korea-investment/korea-investment-quotation-client';

class OverseasGovernmentBond implements OverseasQuotationInquireDailyChartPriceOutput {
    @ApiProperty({
        description: '전일 대비',
    })
    ovrs_nmix_prdy_vrss: string;

    @ApiProperty({
        description: '전일 대비 부호',
    })
    prdy_vrss_sign: string;

    @ApiProperty({
        description: '전일 대비율',
    })
    prdy_ctrt: string;

    @ApiProperty({
        description: '전일 종가',
    })
    ovrs_nmix_prdy_clpr: string;

    @ApiProperty({
        description: '누적 거래량',
    })
    acml_vol: string;

    @ApiProperty({
        description: 'HTS 한글 종목명',
    })
    hts_kor_isnm: string;

    @ApiProperty({
        description: '현재가',
    })
    ovrs_nmix_prpr: string;

    @ApiProperty({
        description: '단축 종목코드',
    })
    stck_shrn_iscd: string;

    @ApiProperty({
        description: '전일 거래량',
    })
    prdy_vol: string;

    @ApiProperty({
        description: '시가',
    })
    ovrs_prod_oprc: string;

    @ApiProperty({
        description: '최고가',
    })
    ovrs_prod_hgpr: string;

    @ApiProperty({
        description: '최저가',
    })
    ovrs_prod_lwpr: string;
}

class OverseasGovernmentBondDaily implements OverseasQuotationInquireDailyChartPriceOutput2 {
    @ApiProperty({
        description: '영업 일자',
    })
    stck_bsop_date: string;

    @ApiProperty({
        description: '현재가',
    })
    ovrs_nmix_prpr: string;

    @ApiProperty({
        description: '시가',
    })
    ovrs_nmix_oprc: string;

    @ApiProperty({
        description: '최고가',
    })
    ovrs_nmix_hgpr: string;

    @ApiProperty({
        description: '최저가',
    })
    ovrs_nmix_lwpr: string;

    @ApiProperty({
        description: '누적 거래량',
    })
    acml_vol: string;

    @ApiProperty({
        description: '변경 여부',
    })
    mod_yn: string;
}

export class OverseasGovernmentBondWithKey {
    @ApiProperty({
        type: String,
    })
    key: string;

    @ApiProperty({
        type: OverseasGovernmentBond,
    })
    data: OverseasGovernmentBond;

    @ApiProperty({
        type: OverseasGovernmentBondDaily,
        isArray: true,
    })
    data2: OverseasGovernmentBondDaily[];
}

export class OverseasGovernmentBondsResponse {
    @ApiProperty({
        type: OverseasGovernmentBondWithKey,
        isArray: true,
    })
    data: OverseasGovernmentBondWithKey[];
}
