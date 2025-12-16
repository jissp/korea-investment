import { ApiProperty } from '@nestjs/swagger';
import { OverseasQuotationInquireDailyChartPriceOutput } from '@modules/korea-investment/korea-investment-quotation-client';

class OverseasIndexPrice implements OverseasQuotationInquireDailyChartPriceOutput {
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

export class OverseasIndexPriceWithKey {
    @ApiProperty({
        type: String,
    })
    key: string;

    @ApiProperty({
        type: OverseasIndexPrice,
    })
    data: OverseasIndexPrice;
}

export class OverseasIndexPriceResponse {
    @ApiProperty({
        type: OverseasIndexPriceWithKey,
        isArray: true,
    })
    data: OverseasIndexPriceWithKey[];
}
