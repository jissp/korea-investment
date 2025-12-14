import { ApiProperty } from '@nestjs/swagger';
import { DomesticStockQuotationsNewsTitleOutput } from '@modules/korea-investment/korea-investment-quotation-client';

class InformationKoreaInvestmentNews implements DomesticStockQuotationsNewsTitleOutput {
    @ApiProperty({
        type: String,
        description: '내용 조회용 일련번호',
    })
    cntt_usiq_srno: string;

    @ApiProperty({
        type: String,
        description: '뉴스 제공 업체 코드',
    })
    news_ofer_entp_code: string;

    @ApiProperty({
        type: String,
        description: '작성일자',
    })
    data_dt: string;

    @ApiProperty({
        type: String,
        description: '작성시간',
    })
    data_tm: string;

    @ApiProperty({
        type: String,
        description: 'HTS 공시 제목 내용',
    })
    hts_pbnt_titl_cntt: string;

    @ApiProperty({
        type: String,
        description: '뉴스 대구분',
    })
    news_lrdv_code: string;

    @ApiProperty({
        type: String,
        description: '자료원',
    })
    dorg: string;

    @ApiProperty({
        type: String,
        description: '종목 코드1',
    })
    iscd1: string;

    @ApiProperty({
        type: String,
        description: '종목 코드2',
    })
    iscd2: string;

    @ApiProperty({
        type: String,
        description: '종목 코드3',
    })
    iscd3: string;

    @ApiProperty({
        type: String,
        description: '종목 코드4',
    })
    iscd4: string;

    @ApiProperty({
        type: String,
        description: '종목 코드5',
    })
    iscd5: string;
}

export class InformationKoreaInvestmentNewsResponse {
    @ApiProperty({
        type: InformationKoreaInvestmentNews,
        isArray: true,
    })
    data: InformationKoreaInvestmentNews[];
}
