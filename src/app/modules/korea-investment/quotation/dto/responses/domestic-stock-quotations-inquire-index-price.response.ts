import { DomesticStockQuotationInquirePriceOutput } from '@modules/korea-investment/korea-investment-client/korea-investment-quotation-client';
import { ApiProperty } from '@nestjs/swagger';

export class DomesticStockQuotationsInquireIndexPriceResponse implements DomesticStockQuotationInquirePriceOutput {
    @ApiProperty({
        type: String,
        description: '종목 상태 구분 코드',
    })
    iscd_stat_cls_code: string;

    @ApiProperty({
        type: String,
        description: '증거금 비율',
    })
    marg_rate: string;

    @ApiProperty({
        type: String,
        description: '대표 시장 한글 명',
    })
    rprs_mrkt_kor_name: string;

    @ApiProperty({
        type: String,
        description: '신 고가 저가 구분 코드',
    })
    new_hgpr_lwpr_cls_code: string;

    @ApiProperty({
        type: String,
        description: '업종 한글 종목명',
    })
    bstp_kor_isnm: string;

    @ApiProperty({
        type: String,
        description: '임시 정지 여부',
    })
    temp_stop_yn: string;

    @ApiProperty({
        type: String,
        description: '시가 범위 연장 여부',
    })
    oprc_rang_cont_yn: string;

    @ApiProperty({
        type: String,
        description: '종가 범위 연장 여부',
    })
    clpr_rang_cont_yn: string;

    @ApiProperty({
        type: String,
        description: '신용 가능 여부',
    })
    crdt_able_yn: string;

    @ApiProperty({
        type: String,
        description: '보증금 비율 구분 코드',
    })
    grmn_rate_cls_code: string;

    @ApiProperty({
        type: String,
        description: 'ELW 발행 여부',
    })
    elw_pblc_yn: string;

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
        description: '주식 시가2',
    })
    stck_oprc: string;

    @ApiProperty({
        type: String,
        description: '주식 최고가',
    })
    stck_hgpr: string;

    @ApiProperty({
        type: String,
        description: '주식 최저가',
    })
    stck_lwpr: string;

    @ApiProperty({
        type: String,
        description: '주식 상한가',
    })
    stck_mxpr: string;

    @ApiProperty({
        type: String,
        description: '주식 하한가',
    })
    stck_llam: string;

    @ApiProperty({
        type: String,
        description: '주식 기준가',
    })
    stck_sdpr: string;

    @ApiProperty({
        type: String,
        description: '가중 평균 주식 가격',
    })
    wghn_avrg_stck_prc: string;

    @ApiProperty({
        type: String,
        description: 'HTS 외국인 소진율',
    })
    hts_frgn_ehrt: string;

    @ApiProperty({
        type: String,
        description: '외국인 순매수 수량',
    })
    frgn_ntby_qty: string;

    @ApiProperty({
        type: String,
        description: '프로그램매매 순매수 수량',
    })
    pgtr_ntby_qty: string;

    @ApiProperty({
        type: String,
        description: '피벗 2차 디저항 가격',
    })
    pvt_scnd_dmrs_prc: string;

    @ApiProperty({
        type: String,
        description: '피벗 1차 디저항 가격',
    })
    pvt_frst_dmrs_prc: string;

    @ApiProperty({
        type: String,
        description: '피벗 포인트 값',
    })
    pvt_pont_val: string;

    @ApiProperty({
        type: String,
        description: '피벗 1차 디지지 가격',
    })
    pvt_frst_dmsp_prc: string;

    @ApiProperty({
        type: String,
        description: '피벗 2차 디지지 가격',
    })
    pvt_scnd_dmsp_prc: string;

    @ApiProperty({
        type: String,
        description: '디저항 값',
    })
    dmrs_val: string;

    @ApiProperty({
        type: String,
        description: '디지지 값',
    })
    dmsp_val: string;

    @ApiProperty({
        type: String,
        description: '자본금',
    })
    cpfn: string;

    @ApiProperty({
        type: String,
        description: '제한 폭 가격',
    })
    rstc_wdth_prc: string;

    @ApiProperty({
        type: String,
        description: '주식 액면가',
    })
    stck_fcam: string;

    @ApiProperty({
        type: String,
        description: '주식 대용가',
    })
    stck_sspr: string;

    @ApiProperty({
        type: String,
        description: '호가단위',
    })
    aspr_unit: string;

    @ApiProperty({
        type: String,
        description: 'HTS 매매 수량 단위 값',
    })
    hts_deal_qty_unit_val: string;

    @ApiProperty({
        type: String,
        description: '상장 주수',
    })
    lstn_stcn: string;

    @ApiProperty({
        type: String,
        description: 'HTS 시가총액',
    })
    hts_avls: string;

    @ApiProperty({
        type: String,
        description: 'PER',
    })
    per: string;

    @ApiProperty({
        type: String,
        description: 'PBR',
    })
    pbr: string;

    @ApiProperty({
        type: String,
        description: '결산 월',
    })
    stac_month: string;

    @ApiProperty({
        type: String,
        description: '거래량 회전율',
    })
    vol_tnrt: string;

    @ApiProperty({
        type: String,
        description: 'EPS',
    })
    eps: string;

    @ApiProperty({
        type: String,
        description: 'BPS',
    })
    bps: string;

    @ApiProperty({
        type: String,
        description: '250일 최고가',
    })
    d250_hgpr: string;

    @ApiProperty({
        type: String,
        description: '250일 최고가 일자',
    })
    d250_hgpr_date: string;

    @ApiProperty({
        type: String,
        description: '250일 최고가 대비 현재가 비율',
    })
    d250_hgpr_vrss_prpr_rate: string;

    @ApiProperty({
        type: String,
        description: '250일 최저가',
    })
    d250_lwpr: string;

    @ApiProperty({
        type: String,
        description: '250일 최저가 일자',
    })
    d250_lwpr_date: string;

    @ApiProperty({
        type: String,
        description: '250일 최저가 대비 현재가 비율',
    })
    d250_lwpr_vrss_prpr_rate: string;

    @ApiProperty({
        type: String,
        description: '주식 연중 최고가',
    })
    stck_dryy_hgpr: string;

    @ApiProperty({
        type: String,
        description: '연중 최고가 대비 현재가 비율',
    })
    dryy_hgpr_vrss_prpr_rate: string;

    @ApiProperty({
        type: String,
        description: '연중 최고가 일자',
    })
    dryy_hgpr_date: string;

    @ApiProperty({
        type: String,
        description: '주식 연중 최저가',
    })
    stck_dryy_lwpr: string;

    @ApiProperty({
        type: String,
        description: '연중 최저가 대비 현재가 비율',
    })
    dryy_lwpr_vrss_prpr_rate: string;

    @ApiProperty({
        type: String,
        description: '연중 최저가 일자',
    })
    dryy_lwpr_date: string;

    @ApiProperty({
        type: String,
        description: '52주일 최고가',
    })
    w52_hgpr: string;

    @ApiProperty({
        type: String,
        description: '52주일 최고가 대비 현재가 대비',
    })
    w52_hgpr_vrss_prpr_ctrt: string;

    @ApiProperty({
        type: String,
        description: '52주일 최고가 일자',
    })
    w52_hgpr_date: string;

    @ApiProperty({
        type: String,
        description: '52주일 최저가',
    })
    w52_lwpr: string;

    @ApiProperty({
        type: String,
        description: '52주일 최저가 대비 현재가 대비',
    })
    w52_lwpr_vrss_prpr_ctrt: string;

    @ApiProperty({
        type: String,
        description: '52주일 최저가 일자',
    })
    w52_lwpr_date: string;

    @ApiProperty({
        type: String,
        description: '전체 융자 잔고 비율',
    })
    whol_loan_rmnd_rate: string;

    @ApiProperty({
        type: String,
        description: '공매도가능여부',
    })
    ssts_yn: string;

    @ApiProperty({
        type: String,
        description: '주식 단축 종목코드',
    })
    stck_shrn_iscd: string;

    @ApiProperty({
        type: String,
        description: '액면가 통화명',
    })
    fcam_cnnm: string;

    @ApiProperty({
        type: String,
        description: '자본금 통화명',
    })
    cpfn_cnnm: string;

    @ApiProperty({
        type: String,
        description: '접근도',
    })
    apprch_rate: string;

    @ApiProperty({
        type: String,
        description: '외국인 보유 수량',
    })
    frgn_hldn_qty: string;

    @ApiProperty({
        type: String,
        description: 'VI적용구분코드',
    })
    vi_cls_code: string;

    @ApiProperty({
        type: String,
        description: '시간외단일가VI적용구분코드',
    })
    ovtm_vi_cls_code: string;

    @ApiProperty({
        type: String,
        description: '최종 공매도 체결 수량',
    })
    last_ssts_cntg_qty: string;

    @ApiProperty({
        type: String,
        description: '투자유의여부',
    })
    invt_caful_yn: string;

    @ApiProperty({
        type: String,
        description: '시장경고코드',
    })
    mrkt_warn_cls_code: string;

    @ApiProperty({
        type: String,
        description: '단기과열여부',
    })
    short_over_yn: string;

    @ApiProperty({
        type: String,
        description: '정리매매여부',
    })
    sltr_yn: string;

    @ApiProperty({
        type: String,
        description: '관리종목여부',
    })
    mang_issu_cls_code: string;
}
