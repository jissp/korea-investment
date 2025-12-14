import { ApiProperty } from '@nestjs/swagger';
import { DomesticStockQuotationInquirePrice2Output } from '@modules/korea-investment/korea-investment-quotation-client';

class DomesticStockQuotationsInquirePrice2 implements DomesticStockQuotationInquirePrice2Output {
    @ApiProperty({
        type: String,
        description: '대표 시장 한글 명',
    })
    rprs_mrkt_kor_name: string;

    @ApiProperty({
        type: String,
        description: '신 고가 저가 구분 코드.특정 경우에만 데이터 출력',
    })
    new_hgpr_lwpr_cls_code: string;

    @ApiProperty({
        type: String,
        description: '상하한가 구분 코드. 특정 경우에만 데이터 출력',
    })
    mxpr_llam_cls_code: string;

    @ApiProperty({
        type: String,
        description: '신용 가능 여부',
    })
    crdt_able_yn: string;

    @ApiProperty({
        type: String,
        description: '주식 상한가',
    })
    stck_mxpr: string;

    @ApiProperty({
        type: String,
        description: 'ELW 발행 여부',
    })
    elw_pblc_yn: string;

    @ApiProperty({
        type: String,
        description: '전일 종가 대비 시가2 비율',
    })
    prdy_clpr_vrss_oprc_rate: string;

    @ApiProperty({
        type: String,
        description: '신용 비율',
    })
    crdt_rate: string;

    @ApiProperty({
        type: String,
        description: '증거금 비율',
    })
    marg_rate: string;

    @ApiProperty({
        type: String,
        description: '최저가 대비 현재가',
    })
    lwpr_vrss_prpr: string;

    @ApiProperty({
        type: String,
        description: '최저가 대비 현재가 부호',
    })
    lwpr_vrss_prpr_sign: string;

    @ApiProperty({
        type: String,
        description: '전일 종가 대비 최저가 비율',
    })
    prdy_clpr_vrss_lwpr_rate: string;

    @ApiProperty({
        type: String,
        description: '주식 최저가',
    })
    stck_lwpr: string;

    @ApiProperty({
        type: String,
        description: '최고가 대비 현재가',
    })
    hgpr_vrss_prpr: string;

    @ApiProperty({
        type: String,
        description: '최고가 대비 현재가 부호',
    })
    hgpr_vrss_prpr_sign: string;

    @ApiProperty({
        type: String,
        description: '전일 종가 대비 최고가 비율',
    })
    prdy_clpr_vrss_hgpr_rate: string;

    @ApiProperty({
        type: String,
        description: '주식 최고가',
    })
    stck_hgpr: string;

    @ApiProperty({
        type: String,
        description: '시가2 대비 현재가',
    })
    oprc_vrss_prpr: string;

    @ApiProperty({
        type: String,
        description: '시가2 대비 현재가 부호',
    })
    oprc_vrss_prpr_sign: string;

    @ApiProperty({
        type: String,
        description: '관리 종목 여부',
    })
    mang_issu_yn: string;

    @ApiProperty({
        type: String,
        description:
            '동시호가배분처리코드. 11:매수상한배분 12:매수하한배분 13: 매도상한배분 14:매도하한배분',
    })
    divi_app_cls_code: string;

    @ApiProperty({
        type: String,
        description: '단기과열여부',
    })
    short_over_yn: string;

    @ApiProperty({
        type: String,
        description:
            '시장경고코드. 00: 없음 01: 투자주의 02:투자경고 03:투자위험',
    })
    mrkt_warn_cls_code: string;

    @ApiProperty({
        type: String,
        description: '투자유의여부',
    })
    invt_caful_yn: string;

    @ApiProperty({
        type: String,
        description: '이상급등여부',
    })
    stange_runup_yn: string;

    @ApiProperty({
        type: String,
        description: '공매도과열 여부',
    })
    ssts_hot_yn: string;

    @ApiProperty({
        type: String,
        description: '저유동성 종목 여부',
    })
    low_current_yn: string;

    @ApiProperty({
        type: String,
        description: 'VI적용구분코드',
    })
    vi_cls_code: string;

    @ApiProperty({
        type: String,
        description: '단기과열구분코드',
    })
    short_over_cls_code: string;

    @ApiProperty({
        type: String,
        description: '주식 하한가',
    })
    stck_llam: string;

    @ApiProperty({
        type: String,
        description: '신규 상장 구분 명',
    })
    new_lstn_cls_name: string;

    @ApiProperty({
        type: String,
        description: '임의 매매 구분 명',
    })
    vlnt_deal_cls_name: string;

    @ApiProperty({
        type: String,
        description: '락 구분 이름.특정 경우에만 데이터 출력',
    })
    flng_cls_name: string;

    @ApiProperty({
        type: String,
        description: '재평가 종목 사유 명. 특정 경우에만 데이터 출력',
    })
    revl_issu_reas_name: string;

    @ApiProperty({
        type: String,
        description:
            '시장 경고 구분 명.특정 경우에만 데이터 출력"투자환기" / "투자경고"',
    })
    mrkt_warn_cls_name: string;

    @ApiProperty({
        type: String,
        description: '주식 기준가',
    })
    stck_sdpr: string;

    @ApiProperty({
        type: String,
        description: '업종 구분 코드',
    })
    bstp_cls_code: string;

    @ApiProperty({
        type: String,
        description: '주식 전일 종가',
    })
    stck_prdy_clpr: string;

    @ApiProperty({
        type: String,
        description: '불성실 공시 여부',
    })
    insn_pbnt_yn: string;

    @ApiProperty({
        type: String,
        description: '액면가 변경 구분 명. 특정 경우에만 데이터 출력',
    })
    fcam_mod_cls_name: string;

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
        description: '누적 거래 대금',
    })
    acml_tr_pbmn: string;

    @ApiProperty({
        type: String,
        description: '누적 거래량',
    })
    acml_vol: string;

    @ApiProperty({
        type: String,
        description: '전일 대비 거래량 비율',
    })
    prdy_vrss_vol_rate: string;

    @ApiProperty({
        type: String,
        description:
            '업종 한글 종목명. ※ 거래소 정보로 특정 종목은 업종구분이 없어 데이터 미회신',
    })
    bstp_kor_isnm: string;

    @ApiProperty({
        type: String,
        description: '정리매매 여부',
    })
    sltr_yn: string;

    @ApiProperty({
        type: String,
        description: '거래정지 여부',
    })
    trht_yn: string;

    @ApiProperty({
        type: String,
        description: '시가 범위 연장 여부',
    })
    oprc_rang_cont_yn: string;

    @ApiProperty({
        type: String,
        description: '임의 종료 구분 코드',
    })
    vlnt_fin_cls_code: string;

    @ApiProperty({
        type: String,
        description: '주식 시가2',
    })
    stck_oprc: string;

    @ApiProperty({
        type: String,
        description: '전일 거래량',
    })
    prdy_vol: string;
}

export class DomesticStockQuotationsInquirePrice2Response {
    @ApiProperty({
        type: DomesticStockQuotationsInquirePrice2,
    })
    data: DomesticStockQuotationsInquirePrice2[];
}
