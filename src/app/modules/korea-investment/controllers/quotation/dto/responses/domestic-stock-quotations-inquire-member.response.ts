import { ApiProperty } from '@nestjs/swagger';
import { DomesticStockQuotationsInquireMemberOutput } from '@modules/korea-investment/korea-investment-client/korea-investment-quotation-client';

class DomesticStockQuotationsInquireMember implements DomesticStockQuotationsInquireMemberOutput {
    @ApiProperty({
        type: String,
        description: '매도 회원사 번호1',
    })
    seln_mbcr_no1: string;

    @ApiProperty({
        type: String,
        description: '매도 회원사 번호2',
    })
    seln_mbcr_no2: string;

    @ApiProperty({
        type: String,
        description: '매도 회원사 번호3',
    })
    seln_mbcr_no3: string;

    @ApiProperty({
        type: String,
        description: '매도 회원사 번호4',
    })
    seln_mbcr_no4: string;

    @ApiProperty({
        type: String,
        description: '매도 회원사 번호5',
    })
    seln_mbcr_no5: string;

    @ApiProperty({
        type: String,
        description: '매도 회원사 명1',
    })
    seln_mbcr_name1: string;

    @ApiProperty({
        type: String,
        description: '매도 회원사 명2',
    })
    seln_mbcr_name2: string;

    @ApiProperty({
        type: String,
        description: '매도 회원사 명3',
    })
    seln_mbcr_name3: string;

    @ApiProperty({
        type: String,
        description: '매도 회원사 명4',
    })
    seln_mbcr_name4: string;

    @ApiProperty({
        type: String,
        description: '매도 회원사 명5',
    })
    seln_mbcr_name5: string;

    @ApiProperty({
        type: String,
        description: '총 매도 수량1',
    })
    total_seln_qty1: string;

    @ApiProperty({
        type: String,
        description: '총 매도 수량2',
    })
    total_seln_qty2: string;

    @ApiProperty({
        type: String,
        description: '총 매도 수량3',
    })
    total_seln_qty3: string;

    @ApiProperty({
        type: String,
        description: '총 매도 수량4',
    })
    total_seln_qty4: string;

    @ApiProperty({
        type: String,
        description: '총 매도 수량5',
    })
    total_seln_qty5: string;

    @ApiProperty({
        type: String,
        description: '매도 회원사 비중1',
    })
    seln_mbcr_rlim1: string;

    @ApiProperty({
        type: String,
        description: '매도 회원사 비중2',
    })
    seln_mbcr_rlim2: string;

    @ApiProperty({
        type: String,
        description: '매도 회원사 비중3',
    })
    seln_mbcr_rlim3: string;

    @ApiProperty({
        type: String,
        description: '매도 회원사 비중4',
    })
    seln_mbcr_rlim4: string;

    @ApiProperty({
        type: String,
        description: '매도 회원사 비중5',
    })
    seln_mbcr_rlim5: string;

    @ApiProperty({
        type: String,
        description: '매도 수량 증감1',
    })
    seln_qty_icdc1: string;

    @ApiProperty({
        type: String,
        description: '매도 수량 증감2',
    })
    seln_qty_icdc2: string;

    @ApiProperty({
        type: String,
        description: '매도 수량 증감3',
    })
    seln_qty_icdc3: string;

    @ApiProperty({
        type: String,
        description: '매도 수량 증감4',
    })
    seln_qty_icdc4: string;

    @ApiProperty({
        type: String,
        description: '매도 수량 증감5',
    })
    seln_qty_icdc5: string;

    @ApiProperty({
        type: String,
        description: '매수2 회원사 번호1',
    })
    shnu_mbcr_no1: string;

    @ApiProperty({
        type: String,
        description: '매수2 회원사 번호2',
    })
    shnu_mbcr_no2: string;

    @ApiProperty({
        type: String,
        description: '매수2 회원사 번호3',
    })
    shnu_mbcr_no3: string;

    @ApiProperty({
        type: String,
        description: '매수2 회원사 번호4',
    })
    shnu_mbcr_no4: string;

    @ApiProperty({
        type: String,
        description: '매수2 회원사 번호5',
    })
    shnu_mbcr_no5: string;

    @ApiProperty({
        type: String,
        description: '매수2 회원사 명1',
    })
    shnu_mbcr_name1: string;

    @ApiProperty({
        type: String,
        description: '매수2 회원사 명2',
    })
    shnu_mbcr_name2: string;

    @ApiProperty({
        type: String,
        description: '매수2 회원사 명3',
    })
    shnu_mbcr_name3: string;

    @ApiProperty({
        type: String,
        description: '매수2 회원사 명4',
    })
    shnu_mbcr_name4: string;

    @ApiProperty({
        type: String,
        description: '매수2 회원사 명5',
    })
    shnu_mbcr_name5: string;

    @ApiProperty({
        type: String,
        description: '총 매수2 수량1',
    })
    total_shnu_qty1: string;

    @ApiProperty({
        type: String,
        description: '총 매수2 수량2',
    })
    total_shnu_qty2: string;

    @ApiProperty({
        type: String,
        description: '총 매수2 수량3',
    })
    total_shnu_qty3: string;

    @ApiProperty({
        type: String,
        description: '총 매수2 수량4',
    })
    total_shnu_qty4: string;

    @ApiProperty({
        type: String,
        description: '총 매수2 수량5',
    })
    total_shnu_qty5: string;

    @ApiProperty({
        type: String,
        description: '매수2 회원사 비중1',
    })
    shnu_mbcr_rlim1: string;

    @ApiProperty({
        type: String,
        description: '매수2 회원사 비중2',
    })
    shnu_mbcr_rlim2: string;

    @ApiProperty({
        type: String,
        description: '매수2 회원사 비중3',
    })
    shnu_mbcr_rlim3: string;

    @ApiProperty({
        type: String,
        description: '매수2 회원사 비중4',
    })
    shnu_mbcr_rlim4: string;

    @ApiProperty({
        type: String,
        description: '매수2 회원사 비중5',
    })
    shnu_mbcr_rlim5: string;

    @ApiProperty({
        type: String,
        description: '매수2 수량 증감1',
    })
    shnu_qty_icdc1: string;

    @ApiProperty({
        type: String,
        description: '매수2 수량 증감2',
    })
    shnu_qty_icdc2: string;

    @ApiProperty({
        type: String,
        description: '매수2 수량 증감3',
    })
    shnu_qty_icdc3: string;

    @ApiProperty({
        type: String,
        description: '매수2 수량 증감4',
    })
    shnu_qty_icdc4: string;

    @ApiProperty({
        type: String,
        description: '매수2 수량 증감5',
    })
    shnu_qty_icdc5: string;

    @ApiProperty({
        type: String,
        description: '외국계 총 매도 수량',
    })
    glob_total_seln_qty: string;

    @ApiProperty({
        type: String,
        description: '외국계 매도 비중',
    })
    glob_seln_rlim: string;

    @ApiProperty({
        type: String,
        description: '외국계 순매수 수량',
    })
    glob_ntby_qty: string;

    @ApiProperty({
        type: String,
        description: '외국계 총 매수2 수량',
    })
    glob_total_shnu_qty: string;

    @ApiProperty({
        type: String,
        description: '외국계 매수2 비중',
    })
    glob_shnu_rlim: string;

    @ApiProperty({
        type: String,
        description: '매도 회원사 외국계 여부1',
    })
    seln_mbcr_glob_yn_1: string;

    @ApiProperty({
        type: String,
        description: '매도 회원사 외국계 여부2',
    })
    seln_mbcr_glob_yn_2: string;

    @ApiProperty({
        type: String,
        description: '매도 회원사 외국계 여부3',
    })
    seln_mbcr_glob_yn_3: string;

    @ApiProperty({
        type: String,
        description: '매도 회원사 외국계 여부4',
    })
    seln_mbcr_glob_yn_4: string;

    @ApiProperty({
        type: String,
        description: '매도 회원사 외국계 여부5',
    })
    seln_mbcr_glob_yn_5: string;

    @ApiProperty({
        type: String,
        description: '매수2 회원사 외국계 여부1',
    })
    shnu_mbcr_glob_yn_1: string;

    @ApiProperty({
        type: String,
        description: '매수2 회원사 외국계 여부2',
    })
    shnu_mbcr_glob_yn_2: string;

    @ApiProperty({
        type: String,
        description: '매수2 회원사 외국계 여부3',
    })
    shnu_mbcr_glob_yn_3: string;

    @ApiProperty({
        type: String,
        description: '매수2 회원사 외국계 여부4',
    })
    shnu_mbcr_glob_yn_4: string;

    @ApiProperty({
        type: String,
        description: '매수2 회원사 외국계 여부5',
    })
    shnu_mbcr_glob_yn_5: string;

    @ApiProperty({
        type: String,
        description: '외국계 총 매도 수량 증감',
    })
    glob_total_seln_qty_icdc: string;

    @ApiProperty({
        type: String,
        description: '외국계 총 매수2 수량 증감',
    })
    glob_total_shnu_qty_icdc: string;
}

export class DomesticStockQuotationsInquireMemberResponse {
    @ApiProperty({
        type: [DomesticStockQuotationsInquireMember],
    })
    data: DomesticStockQuotationsInquireMember[];
}
