import { ApiProperty } from '@nestjs/swagger';
import {
    MarketDivCode,
    PeriodType,
    ProductType,
} from '@modules/korea-investment/common/base.types';

export interface ForeignInstitutionTotalParam {
    /**
     * 시장 분류 코드
     * (V: Default)
     */
    FID_COND_MRKT_DIV_CODE: string;

    /**
     * 조건 화면 분류 코드
     * (16449: Default)
     */
    FID_COND_SCR_DIV_CODE: string;

    /**
     * 입력 종목코드
     * (0000:전체, 0001:코스피, 1001:코스닥 등)
     */
    FID_INPUT_ISCD: string;

    /**
     * 분류 구분 코드
     * (0: 수량정열, 1: 금액정열)
     */
    FID_DIV_CLS_CODE: string;

    /**
     * 순위 정렬 구분 코드
     * (0: 순매수상위, 1: 순매도상위)
     */
    FID_RANK_SORT_CLS_CODE: string;

    /**
     * 기타 구분 정렬
     * (0:전체 1:외국인 2:기관계 3:기타)
     */
    FID_ETC_CLS_CODE: string;
}

export class ForeignInstitutionTotalOutput {
    /**
     * HTS 한글 종목명
     */
    hts_kor_isnm: string;

    /**
     * 유가증권 단축 종목코드
     */
    mksc_shrn_iscd: string;

    /**
     * 순매수 수량
     */
    ntby_qty: string;

    /**
     * 주식 현재가
     */
    stck_prpr: string;

    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 전일 대비
     */
    prdy_vrss: string;

    /**
     * 전일 대비율
     */
    prdy_ctrt: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 외국인 순매수 수량
     */
    frgn_ntby_qty: string;

    /**
     * 기관계 순매수 수량
     */
    orgn_ntby_qty: string;

    /**
     * 투자신탁 순매수 수량
     */
    ivtr_ntby_qty: string;

    /**
     * 은행 순매수 수량
     */
    bank_ntby_qty: string;

    /**
     * 보험 순매수 수량
     */
    insu_ntby_qty: string;

    /**
     * 종금 순매수 수량
     */
    mrbn_ntby_qty: string;

    /**
     * 기금 순매수 수량
     */
    fund_ntby_qty: string;

    /**
     * 기타 단체 순매수 거래량
     */
    etc_orgt_ntby_vol: string;

    /**
     * 기타 법인 순매수 거래량
     */
    etc_corp_ntby_vol: string;

    /**
     * 외국인 순매수 거래 대금
     * (단위 : 백만원, 수량*현재가)
     */
    frgn_ntby_tr_pbmn: string;

    /**
     * 기관계 순매수 거래 대금
     */
    orgn_ntby_tr_pbmn: string;

    /**
     * 투자신탁 순매수 거래 대금
     */
    ivtr_ntby_tr_pbmn: string;

    /**
     * 은행 순매수 거래 대금
     */
    bank_ntby_tr_pbmn: string;

    /**
     * 보험 순매수 거래 대금
     */
    insu_ntby_tr_pbmn: string;

    /**
     * 종금 순매수 거래 대금
     */
    mrbn_ntby_tr_pbmn: string;

    /**
     * 기금 순매수 거래 대금
     */
    fund_ntby_tr_pbmn: string;

    /**
     * 기타 단체 순매수 거래 대금
     */
    etc_orgt_ntby_tr_pbmn: string;

    /**
     * 기타 법인 순매수 거래 대금
     */
    etc_corp_ntby_tr_pbmn: string;
}

export interface KoreaInvestmentAccountParam {
    /**
     * 종합계좌번호
     * 계좌번호 체계(8-2)의 앞 8자리
     */
    CANO: string;

    /**
     * 계좌상품코드
     * 계좌번호 체계(8-2)의 뒤 2자리
     */
    ACNT_PRDT_CD: string;

    /**
     * 조회구분1
     * 공백입력
     */
    INQR_DVSN_1: string;

    /**
     * 기준가이전일자적용여부
     * 공백입력
     */
    BSPR_BF_DT_APLY_YN: string;
}

export class KoreaInvestmentAccountOutput {
    @ApiProperty({
        description: '매입금액',
    })
    pchs_amt: string;

    @ApiProperty({
        description: '평가금액',
    })
    evlu_amt: string;

    @ApiProperty({
        description: '평가손익금액',
    })
    evlu_pfls_amt: string;

    @ApiProperty({
        description: '신용대출금액',
    })
    crdt_lnd_amt: string;

    @ApiProperty({
        description: '실제순자산금액',
    })
    real_nass_amt: string;

    @ApiProperty({
        description: '전체비중율',
    })
    whol_weit_rt: string;
}

export class KoreaInvestmentAccountOutput2 {
    @ApiProperty({
        description: '매입금액합계 유가매입금액',
    })
    pchs_amt_smtl: string;

    @ApiProperty({
        description: '순자산총금액',
    })
    nass_tot_amt: string;

    @ApiProperty({
        description: '대출금액합계',
    })
    loan_amt_smtl: string;

    @ApiProperty({
        description: '평가손익금액합계 평가손익금액',
    })
    evlu_pfls_amt_smtl: string;

    @ApiProperty({
        description: '평가금액합계 유가평가금액',
    })
    evlu_amt_smtl: string;

    @ApiProperty({
        description: '총자산금액 총 자산금액',
    })
    tot_asst_amt: string;

    @ApiProperty({
        description: '총대출금액총융자대출금액',
    })
    tot_lnda_tot_ulst_lnda: string;

    @ApiProperty({
        description: 'CMA자동대출금액',
    })
    cma_auto_loan_amt: string;

    @ApiProperty({
        description: '총담보대출금액',
    })
    tot_mgln_amt: string;

    @ApiProperty({
        description: '대주평가금액',
    })
    stln_evlu_amt: string;

    @ApiProperty({
        description: '신용융자금액',
    })
    crdt_fncg_amt: string;

    @ApiProperty({
        description: 'OCL_APL대출금액',
    })
    ocl_apl_loan_amt: string;

    @ApiProperty({
        description: '질권설정금액',
    })
    pldg_stup_amt: string;

    @ApiProperty({
        description: '외화평가총액',
    })
    frcr_evlu_tota: string;

    @ApiProperty({
        description: '총예수금액',
    })
    tot_dncl_amt: string;

    @ApiProperty({
        description: 'CMA평가금액',
    })
    cma_evlu_amt: string;

    @ApiProperty({
        description: '예수금액',
    })
    dncl_amt: string;

    @ApiProperty({
        description: '총대용금액',
    })
    tot_sbst_amt: string;

    @ApiProperty({
        description: '당일미수금액',
    })
    thdt_rcvb_amt: string;

    @ApiProperty({
        description: '해외주식평가금액1',
    })
    ovrs_stck_evlu_amt1: string;

    @ApiProperty({
        description: '해외채권평가금액',
    })
    ovrs_bond_evlu_amt: string;

    @ApiProperty({
        description: 'MMFCMA담보대출금액',
    })
    mmf_cma_mgge_loan_amt: string;

    @ApiProperty({
        description: '청약예수금액',
    })
    sbsc_dncl_amt: string;

    @ApiProperty({
        description: '공모주청약자금대출사용금액',
    })
    pbst_sbsc_fnds_loan_use_amt: string;

    @ApiProperty({
        description: '기업신용공여대출금액',
    })
    etpr_crdt_grnt_loan_amt: string;
}

export interface KoreaInvestmentAccountStockParam {
    /**
     * 종합계좌번호 계좌번호 체계(8-2)의 앞 8자리
     */
    CANO: string;

    /**
     * 계좌상품코드 계좌번호 체계(8-2)의 뒤 2자리
     */
    ACNT_PRDT_CD: string;

    /**
     * 시간외단일가, 거래소여부
     * N : 기본값
     * Y : 시간외단일가
     * X : NXT 정규장 (프리마켓, 메인, 애프터마켓)
     * ※ NXT 선택 시 : NXT 거래종목만 시세 등 정보가 NXT 기준으로 변동됩니다.
     * KRX 종목들은 그대로 유지
     */
    AFHR_FLPR_YN: string;

    /**
     * 오프라인여부 공란(Default)
     */
    OFL_YN?: string;

    /**
     * 조회구분
     * 01 : 대출일별
     * 02 : 종목별
     */
    INQR_DVSN: string;

    /**
     * 단가구분
     * 01 : 기본값
     */
    UNPR_DVSN: string;

    /**
     * 펀드결제분포함여부
     * N : 포함하지 않음
     * Y : 포함
     */
    FUND_STTL_ICLD_YN: string;

    /**
     * 융자금액자동상환여부
     * N : 기본값
     */
    FNCG_AMT_AUTO_RDPT_YN: string;

    /**
     * 처리구분
     * 00 : 전일매매포함
     * 01 : 전일매매미포함
     */
    PRCS_DVSN: string;

    /**
     * 연속조회검색조건100
     * 공란 : 최초 조회시 이전 조회 Output
     * CTX_AREA_FK100 값 : 다음페이지 조회시(2번째부터)
     */
    CTX_AREA_FK100?: string;

    /**
     * 연속조회키100
     * 공란 : 최초 조회시 이전 조회 Output
     * CTX_AREA_NK100 값 : 다음페이지 조회시(2번째부터)
     */
    CTX_AREA_NK100?: string;
}

export class KoreaInvestmentAccountStockOutput {
    @ApiProperty({
        description: '상품번호 종목번호(뒷 6자리)',
    })
    pdno: string;

    @ApiProperty({
        description: '상품명 종목명',
    })
    prdt_name: string;

    @ApiProperty({
        description: '매매구분명 매수매도구분',
    })
    trad_dvsn_name: string;

    @ApiProperty({
        description: '전일매수수량',
    })
    bfdy_buy_qty: string;

    @ApiProperty({
        description: '전일매도수량',
    })
    bfdy_sll_qty: string;

    @ApiProperty({
        description: '금일매수수량',
    })
    thdt_buyqty: string;

    @ApiProperty({
        description: '금일매도수량',
    })
    thdt_sll_qty: string;

    @ApiProperty({
        description: '보유수량',
    })
    hldg_qty: string;

    @ApiProperty({
        description: '주문가능수량',
    })
    ord_psbl_qty: string;

    @ApiProperty({
        description: '매입평균가격 매입금액 / 보유수량',
    })
    pchs_avg_pric: string;

    @ApiProperty({
        description: '매입금액',
    })
    pchs_amt: string;

    @ApiProperty({
        description: '현재가',
    })
    prpr: string;

    @ApiProperty({
        description: '평가금액',
    })
    evlu_amt: string;

    @ApiProperty({
        description: '평가손익금액 평가금액 - 매입금액',
    })
    evlu_pfls_amt: string;

    @ApiProperty({
        description: '평가손익율',
    })
    evlu_pfls_rt: string;

    @ApiProperty({
        description: '평가수익율 미사용항목(0으로 출력)',
    })
    evlu_erng_rt: string;

    @ApiProperty({
        description:
            '대출일자 INQR_DVSN(조회구분)을 01(대출일별)로 설정해야 값이 나옴',
    })
    loan_dt: string;

    @ApiProperty({
        description: '대출금액',
    })
    loan_amt: string;

    @ApiProperty({
        description: '대주매각대금',
    })
    stln_slng_chgs: string;

    @ApiProperty({
        description: '만기일자',
    })
    expd_dt: string;

    @ApiProperty({
        description: '등락율',
    })
    fltt_rt: string;

    @ApiProperty({
        description: '전일대비증감',
    })
    bfdy_cprs_icdc: string;

    @ApiProperty({
        description: '종목증거금율명',
    })
    item_mgna_rt_name: string;

    @ApiProperty({
        description: '보증금율명',
    })
    grta_rt_name: string;

    @ApiProperty({
        description:
            '대용가격 증권매매의 위탁보증금으로서 현금 대신에 사용되는 유가증권 가격',
    })
    sbst_pric: string;

    @ApiProperty({
        description: '주식대출단가',
    })
    stck_loan_unpr: string;
}

export class KoreaInvestmentAccountStockOutput2 {
    /**
     * 예수금총금액 예수금
     */
    @ApiProperty({
        description: '예수금총금액 예수금',
    })
    dnca_tot_amt: string;

    /**
     * 익일정산금액 D+1 예수금
     */
    @ApiProperty({
        description: '익일정산금액 D+1 예수금',
    })
    nxdy_excc_amt: string;

    /**
     * 가수도정산금액 D+2 예수금
     */
    @ApiProperty({
        description: '가수도정산금액 D+2 예수금',
    })
    prvs_rcdl_excc_amt: string;

    /**
     * CMA평가금액
     */
    @ApiProperty({
        description: 'CMA평가금액',
    })
    cma_evlu_amt: string;

    /**
     * 전일매수금액
     */
    @ApiProperty({
        description: '전일매수금액',
    })
    bfdy_buy_amt: string;

    /**
     * 금일매수금액
     */
    @ApiProperty({
        description: '금일매수금액',
    })
    thdt_buy_amt: string;

    /**
     * 익일자동상환금액
     */
    @ApiProperty({
        description: '익일자동상환금액',
    })
    nxdy_auto_rdpt_amt: string;

    /**
     * 전일매도금액
     */
    @ApiProperty({
        description: '전일매도금액',
    })
    bfdy_sll_amt: string;

    /**
     * 금일매도금액
     */
    @ApiProperty({
        description: '금일매도금액',
    })
    thdt_sll_amt: string;

    /**
     * D+2자동상환금액
     */
    @ApiProperty({
        description: 'D+2자동상환금액',
    })
    d2_auto_rdpt_amt: string;

    /**
     * 전일제비용금액
     */
    @ApiProperty({
        description: '전일제비용금액',
    })
    bfdy_tlex_amt: string;

    /**
     * 금일제비용금액
     */
    @ApiProperty({
        description: '금일제비용금액',
    })
    thdt_tlex_amt: string;

    /**
     * 총대출금액
     */
    @ApiProperty({
        description: '총대출금액',
    })
    tot_loan_amt: string;

    /**
     * 유가평가금액
     */
    @ApiProperty({
        description: '유가평가금액',
    })
    scts_evlu_amt: string;

    /**
     * 총평가금액 유가증권 평가금액 합계금액 + D+2 예수금
     */
    @ApiProperty({
        description: '총평가금액 유가증권 평가금액 합계금액 + D+2 예수금',
    })
    tot_evlu_amt: string;

    /**
     * 순자산금액
     */
    @ApiProperty({
        description: '순자산금액',
    })
    nass_amt: string;

    /**
     * 융자금자동상환여부 보유현금에 대한 융자금만 차감여부
     * 신용융자 매수체결 시점에서는 융자비율을 매매대금 100%로 계산 하였다가 수도결제일에 보증금에 해당하는 금액을 고객의 현금으로 충당하여 융자금을 감소시키는 업무
     */
    @ApiProperty({
        description:
            '융자금자동상환여부 보유현금에 대한 융자금만 차감여부\n신용융자 매수체결 시점에서는 융자비율을 매매대금 100%로 계산 하였다가 수도결제일에 보증금에 해당하는 금액을 고객의 현금으로 충당하여 융자금을 감소시키는 업무',
    })
    fncg_gld_auto_rdpt_yn: string;

    /**
     * 매입금액합계금액
     */
    @ApiProperty({
        description: '매입금액합계금액',
    })
    pchs_amt_smtl_amt: string;

    /**
     * 평가금액합계금액 유가증권 평가금액 합계금액
     */
    @ApiProperty({
        description: '평가금액합계금액 유가증권 평가금액 합계금액',
    })
    evlu_amt_smtl_amt: string;

    /**
     * 평가손익합계금액
     */
    @ApiProperty({
        description: '평가손익합계금액',
    })
    evlu_pfls_smtl_amt: string;

    /**
     * 총대주매각대금
     */
    @ApiProperty({
        description: '총대주매각대금',
    })
    tot_stln_slng_chgs: string;

    /**
     * 전일총자산평가금액
     */
    @ApiProperty({
        description: '전일총자산평가금액',
    })
    bfdy_tot_asst_evlu_amt: string;

    /**
     * 자산증감액
     */
    @ApiProperty({
        description: '자산증감액',
    })
    asst_icdc_amt: string;

    /**
     * 자산증감수익율 데이터 미제공
     */
    @ApiProperty({
        description: '자산증감수익율 데이터 미제공',
    })
    asst_icdc_erng_rt: string;
}

export interface DomesticSearchStockInfoParam {
    /**
     * 상품유형코드
     */
    PRDT_TYPE_CD: ProductType;

    /**
     * 종목번호 (6자리)
     * ETN의 경우, Q로 시작 (EX. Q500001)
     */
    PDNO: string;
}

export class DomesticSearchStockInfoOutput {
    /**
     * 상품번호
     */
    @ApiProperty({
        description: '상품번호',
    })
    pdno: string;

    /**
     * 상품유형코드
     */
    @ApiProperty({
        description: '상품유형코드',
    })
    prdt_type_cd: string;

    /**
     * 시장ID코드
     */
    @ApiProperty({
        description: '시장ID코드',
    })
    mket_id_cd: string;

    /**
     * 증권그룹ID코드
     */
    @ApiProperty({
        description: '증권그룹ID코드',
    })
    scty_grp_id_cd: string;

    /**
     * 거래소구분코드
     */
    @ApiProperty({
        description: '거래소구분코드',
    })
    excg_dvsn_cd: string;

    /**
     * 결산월일
     */
    @ApiProperty({
        description: '결산월일',
    })
    setl_mmdd: string;

    /**
     * 상장주수
     */
    @ApiProperty({
        description: '상장주수',
    })
    lstg_stqt: string;

    /**
     * 상장자본금액
     */
    @ApiProperty({
        description: '상장자본금액',
    })
    lstg_cptl_amt: string;

    /**
     * 자본금
     */
    @ApiProperty({
        description: '자본금',
    })
    cpta: string;

    /**
     * 액면가
     */
    @ApiProperty({
        description: '액면가',
    })
    papr: string;

    /**
     * 발행가격
     */
    @ApiProperty({
        description: '발행가격',
    })
    issu_pric: string;

    /**
     * 코스피200종목여부
     */
    @ApiProperty({
        description: '코스피200종목여부',
    })
    kospi200_item_yn: string;

    /**
     * 유가증권시장상장일자
     */
    @ApiProperty({
        description: '유가증권시장상장일자',
    })
    scts_mket_lstg_dt: string;

    /**
     * 유가증권시장상장폐지일자
     */
    @ApiProperty({
        description: '유가증권시장상장폐지일자',
    })
    scts_mket_lstg_abol_dt: string;

    /**
     * 코스닥시장상장일자
     */
    @ApiProperty({
        description: '코스닥시장상장일자',
    })
    kosdaq_mket_lstg_dt: string;

    /**
     * 코스닥시장상장폐지일자
     */
    @ApiProperty({
        description: '코스닥시장상장폐지일자',
    })
    kosdaq_mket_lstg_abol_dt: string;

    /**
     * 프리보드시장상장일자
     */
    @ApiProperty({
        description: '프리보드시장상장일자',
    })
    frbd_mket_lstg_dt: string;

    /**
     * 프리보드시장상장폐지일자
     */
    @ApiProperty({
        description: '프리보드시장상장폐지일자',
    })
    frbd_mket_lstg_abol_dt: string;

    /**
     * 리츠종류코드
     */
    @ApiProperty({
        description: '리츠종류코드',
    })
    reits_kind_cd: string;

    /**
     * ETF구분코드
     */
    @ApiProperty({
        description: 'ETF구분코드',
    })
    etf_dvsn_cd: string;

    /**
     * 유전펀드여부
     */
    @ApiProperty({
        description: '유전펀드여부',
    })
    oilf_fund_yn: string;

    /**
     * 지수업종대분류코드
     */
    @ApiProperty({
        description: '지수업종대분류코드',
    })
    idx_bztp_lcls_cd: string;

    /**
     * 지수업종중분류코드
     */
    @ApiProperty({
        description: '지수업종중분류코드',
    })
    idx_bztp_mcls_cd: string;

    /**
     * 지수업종소분류코드
     */
    @ApiProperty({
        description: '지수업종소분류코드',
    })
    idx_bztp_scls_cd: string;

    /**
     * 주식종류코드
     */
    @ApiProperty({
        description: '주식종류코드',
    })
    stck_kind_cd: string;

    /**
     * 뮤추얼펀드개시일자
     */
    @ApiProperty({
        description: '뮤추얼펀드개시일자',
    })
    mfnd_opng_dt: string;

    /**
     * 뮤추얼펀드종료일자
     */
    @ApiProperty({
        description: '뮤추얼펀드종료일자',
    })
    mfnd_end_dt: string;

    /**
     * 예탁등록취소일자
     */
    @ApiProperty({
        description: '예탁등록취소일자',
    })
    dpsi_erlm_cncl_dt: string;

    /**
     * ETFCU수량
     */
    @ApiProperty({
        description: 'ETFCU수량',
    })
    etf_cu_qty: string;

    /**
     * 상품명
     */
    @ApiProperty({
        description: '상품명',
    })
    prdt_name: string;

    /**
     * 상품명120
     */
    @ApiProperty({
        description: '상품명120',
    })
    prdt_name120: string;

    /**
     * 상품약어명
     */
    @ApiProperty({
        description: '상품약어명',
    })
    prdt_abrv_name: string;

    /**
     * 표준상품번호
     */
    @ApiProperty({
        description: '표준상품번호',
    })
    std_pdno: string;

    /**
     * 상품영문명
     */
    @ApiProperty({
        description: '상품영문명',
    })
    prdt_eng_name: string;

    /**
     * 상품영문명120
     */
    @ApiProperty({
        description: '상품영문명120',
    })
    prdt_eng_name120: string;

    /**
     * 상품영문약어명
     */
    @ApiProperty({
        description: '상품영문약어명',
    })
    prdt_eng_abrv_name: string;

    /**
     * 예탁지정등록여부
     */
    @ApiProperty({
        description: '예탁지정등록여부',
    })
    dpsi_aptm_erlm_yn: string;

    /**
     * ETF과세유형코드
     */
    @ApiProperty({
        description: 'ETF과세유형코드',
    })
    etf_txtn_type_cd: string;

    /**
     * ETF유형코드
     */
    @ApiProperty({
        description: 'ETF유형코드',
    })
    etf_type_cd: string;

    /**
     * 상장폐지일자
     */
    @ApiProperty({
        description: '상장폐지일자',
    })
    lstg_abol_dt: string;

    /**
     * 신주구주구분코드
     */
    @ApiProperty({
        description: '신주구주구분코드',
    })
    nwst_odst_dvsn_cd: string;

    /**
     * 대용가격
     */
    @ApiProperty({
        description: '대용가격',
    })
    sbst_pric: string;

    /**
     * 당사대용가격
     */
    @ApiProperty({
        description: '당사대용가격',
    })
    thco_sbst_pric: string;

    /**
     * 당사대용가격변경일자
     */
    @ApiProperty({
        description: '당사대용가격변경일자',
    })
    thco_sbst_pric_chng_dt: string;

    /**
     * 거래정지여부
     */
    @ApiProperty({
        description: '거래정지여부',
    })
    tr_stop_yn: string;

    /**
     * 관리종목여부
     */
    @ApiProperty({
        description: '관리종목여부',
    })
    admn_item_yn: string;

    /**
     * 당일종가
     */
    @ApiProperty({
        description: '당일종가',
    })
    thdt_clpr: string;

    /**
     * 전일종가
     */
    @ApiProperty({
        description: '전일종가',
    })
    bfdy_clpr: string;

    /**
     * 종가변경일자
     */
    @ApiProperty({
        description: '종가변경일자',
    })
    clpr_chng_dt: string;

    /**
     * 표준산업분류코드
     */
    @ApiProperty({
        description: '표준산업분류코드',
    })
    std_idst_clsf_cd: string;

    /**
     * 표준산업분류코드명
     */
    @ApiProperty({
        description: '표준산업분류코드명',
    })
    std_idst_clsf_cd_name: string;

    /**
     * 지수업종대분류코드명
     */
    @ApiProperty({
        description: '지수업종대분류코드명',
    })
    idx_bztp_lcls_cd_name: string;

    /**
     * 지수업종중분류코드명
     */
    @ApiProperty({
        description: '지수업종중분류코드명',
    })
    idx_bztp_mcls_cd_name: string;

    /**
     * 지수업종소분류코드명
     */
    @ApiProperty({
        description: '지수업종소분류코드명',
    })
    idx_bztp_scls_cd_name: string;

    /**
     * OCR번호
     */
    @ApiProperty({
        description: 'OCR번호',
    })
    ocr_no: string;

    /**
     * 크라우드펀딩종목여부
     */
    @ApiProperty({
        description: '크라우드펀딩종목여부',
    })
    crfd_item_yn: string;

    /**
     * 전자증권여부
     */
    @ApiProperty({
        description: '전자증권여부',
    })
    elec_scty_yn: string;

    /**
     * 발행기관코드
     */
    @ApiProperty({
        description: '발행기관코드',
    })
    issu_istt_cd: string;

    /**
     * ETF추적수익율배수
     */
    @ApiProperty({
        description: 'ETF추적수익율배수',
    })
    etf_chas_erng_rt_dbnb: string;

    /**
     * ETFETN투자유의종목여부
     */
    @ApiProperty({
        description: 'ETFETN투자유의종목여부',
    })
    etf_etn_ivst_heed_item_yn: string;

    /**
     * 대주이자율구분코드
     */
    @ApiProperty({
        description: '대주이자율구분코드',
    })
    stln_int_rt_dvsn_cd: string;

    /**
     * 외국인개인한도비율
     */
    @ApiProperty({
        description: '외국인개인한도비율',
    })
    frnr_psnl_lmt_rt: string;

    /**
     * 상장신청인발행기관코드
     */
    @ApiProperty({
        description: '상장신청인발행기관코드',
    })
    lstg_rqsr_issu_istt_cd: string;

    /**
     * 상장신청인종목코드
     */
    @ApiProperty({
        description: '상장신청인종목코드',
    })
    lstg_rqsr_item_cd: string;

    /**
     * 신탁기관발행기관코드
     */
    @ApiProperty({
        description: '신탁기관발행기관코드',
    })
    trst_istt_issu_istt_cd: string;

    /**
     * NXT 거래종목여부
     */
    @ApiProperty({
        description: 'NXT 거래종목여부',
    })
    cptt_trad_tr_psbl_yn: string;

    /**
     * NXT 거래정지여부
     */
    @ApiProperty({
        description: 'NXT 거래정지여부',
    })
    nxt_tr_stop_yn: string;
}

export interface DomesticProgramTradeTodayParam {
    /**
     * 거래소 구분 코드 (J: KRX, NX: NXT, UN: 통합)
     */
    EXCH_DIV_CLS_CODE: MarketDivCode;

    /**
     * 시장 구분 코드 (1: 코스피, 4: 코스닥)
     */
    MRKT_DIV_CLS_CODE: string;
}

export class DomesticProgramTradeTodayOutput1 {
    /**
     * 투자자코드
     */
    @ApiProperty({
        description: '투자자코드',
    })
    invr_cls_code: string;

    /**
     * 전체매도수량
     */
    @ApiProperty({
        description: '전체매도수량',
    })
    all_seln_qty: string;

    /**
     * 전체매도대금
     */
    @ApiProperty({
        description: '전체매도대금',
    })
    all_seln_amt: string;

    /**
     * 투자자 구분 명
     */
    @ApiProperty({
        description: '투자자 구분 명',
    })
    invr_cls_name: string;

    /**
     * 전체매수수량
     */
    @ApiProperty({
        description: '전체매수수량',
    })
    all_shnu_qty: string;

    /**
     * 전체매수대금
     */
    @ApiProperty({
        description: '전체매수대금',
    })
    all_shnu_amt: string;

    /**
     * 전체순매수대금
     */
    @ApiProperty({
        description: '전체순매수대금',
    })
    all_ntby_amt: string;

    /**
     * 차익매도수량
     */
    @ApiProperty({
        description: '차익매도수량',
    })
    arbt_seln_qty: string;

    /**
     * 전체순매수수량
     */
    @ApiProperty({
        description: '전체순매수수량',
    })
    all_ntby_qty: string;

    /**
     * 차익매수수량
     */
    @ApiProperty({
        description: '차익매수수량',
    })
    arbt_shnu_qty: string;

    /**
     * 차익순매수수량
     */
    @ApiProperty({
        description: '차익순매수수량',
    })
    arbt_ntby_qty: string;

    /**
     * 차익매도대금
     */
    @ApiProperty({
        description: '차익매도대금',
    })
    arbt_seln_amt: string;

    /**
     * 차익매수대금
     */
    @ApiProperty({
        description: '차익매수대금',
    })
    arbt_shnu_amt: string;

    /**
     * 차익순매수대금
     */
    @ApiProperty({
        description: '차익순매수대금',
    })
    arbt_ntby_amt: string;

    /**
     * 비차익매도수량
     */
    @ApiProperty({
        description: '비차익매도수량',
    })
    nabt_seln_qty: string;

    /**
     * 비차익매수수량
     */
    @ApiProperty({
        description: '비차익매수수량',
    })
    nabt_shnu_qty: string;

    /**
     * 비차익순매수수량
     */
    @ApiProperty({
        description: '비차익순매수수량',
    })
    nabt_ntby_qty: string;

    /**
     * 비차익매도대금
     */
    @ApiProperty({
        description: '비차익매도대금',
    })
    nabt_seln_amt: string;

    /**
     * 비차익매수대금
     */
    @ApiProperty({
        description: '비차익매수대금',
    })
    nabt_shnu_amt: string;

    /**
     * 비차익순매수대금
     */
    @ApiProperty({
        description: '비차익순매수대금',
    })
    nabt_ntby_amt: string;
}

export interface DomesticInvestorTradeByStockDailyParam {
    /**
     * 조건 시장 분류 코드
     * J:KRX, NX:NXT, UN:통합
     */
    FID_COND_MRKT_DIV_CODE: MarketDivCode;

    /**
     * 입력 종목코드 (6자리)
     */
    FID_INPUT_ISCD: string;

    /**
     * 입력 날짜1 (YYYYMMDD)
     */
    FID_INPUT_DATE_1: string;

    /**
     * 수정주가 원주가 가격 (공란 입력)
     */
    FID_ORG_ADJ_PRC: string;

    /**
     * 기타 구분 코드 (공란 입력)
     */
    FID_ETC_CLS_CODE: string;
}

export class DomesticInvestorTradeByStockDailyOutput1 {
    /**
     * 주식 현재가
     */
    @ApiProperty({
        description: '주식 현재가',
    })
    stck_prpr: string;

    /**
     * 전일 대비
     */
    @ApiProperty({
        description: '전일 대비',
    })
    prdy_vrss: string;

    /**
     * 전일 대비 부호
     */
    @ApiProperty({
        description: '전일 대비 부호',
    })
    prdy_vrss_sign: string;

    /**
     * 전일 대비율
     */
    @ApiProperty({
        description: '전일 대비율',
    })
    prdy_ctrt: string;

    /**
     * 누적 거래량
     */
    @ApiProperty({
        description: '누적 거래량',
    })
    acml_vol: string;

    /**
     * 전일 거래량
     */
    @ApiProperty({
        description: '전일 거래량',
    })
    prdy_vol: string;

    /**
     * 대표 시장 한글 명
     */
    @ApiProperty({
        description: '대표 시장 한글 명',
    })
    rprs_mrkt_kor_name: string;
}

export class DomesticInvestorTradeByStockDailyOutput2 {
    /**
     * 주식 영업 일자
     */
    @ApiProperty({
        description: '주식 영업 일자',
    })
    stck_bsop_date: string;

    /**
     * 주식 종가
     */
    @ApiProperty({
        description: '주식 종가',
    })
    stck_clpr: string;

    /**
     * 전일 대비
     */
    @ApiProperty({
        description: '전일 대비',
    })
    prdy_vrss: string;

    /**
     * 전일 대비 부호
     */
    @ApiProperty({
        description: '전일 대비 부호',
    })
    prdy_vrss_sign: string;

    /**
     * 전일 대비율
     */
    @ApiProperty({
        description: '전일 대비율',
    })
    prdy_ctrt: string;

    /**
     * 누적 거래량 (주)
     */
    @ApiProperty({
        description: '누적 거래량 (주)',
    })
    acml_vol: string;

    /**
     * 누적 거래 대금 (백만원)
     */
    @ApiProperty({
        description: '누적 거래 대금 (백만원)',
    })
    acml_tr_pbmn: string;

    /**
     * 주식 시가
     */
    @ApiProperty({
        description: '주식 시가',
    })
    stck_oprc: string;

    /**
     * 주식 최고가
     */
    @ApiProperty({
        description: '주식 최고가',
    })
    stck_hgpr: string;

    /**
     * 주식 최저가
     */
    @ApiProperty({
        description: '주식 최저가',
    })
    stck_lwpr: string;

    /**
     * 외국인 순매수 수량
     */
    @ApiProperty({
        description: '외국인 순매수 수량',
    })
    frgn_ntby_qty: string;

    /**
     * 외국인 등록 순매수 수량
     */
    @ApiProperty({
        description: '외국인 등록 순매수 수량',
    })
    frgn_reg_ntby_qty: string;

    /**
     * 외국인 비등록 순매수 수량
     */
    @ApiProperty({
        description: '외국인 비등록 순매수 수량',
    })
    frgn_nreg_ntby_qty: string;

    /**
     * 개인 순매수 수량
     */
    @ApiProperty({
        description: '개인 순매수 수량',
    })
    prsn_ntby_qty: string;

    /**
     * 기관계 순매수 수량
     */
    @ApiProperty({
        description: '기관계 순매수 수량',
    })
    orgn_ntby_qty: string;

    /**
     * 증권 순매수 수량
     */
    @ApiProperty({
        description: '증권 순매수 수량',
    })
    scrt_ntby_qty: string;

    /**
     * 투자신탁 순매수 수량
     */
    @ApiProperty({
        description: '투자신탁 순매수 수량',
    })
    ivtr_ntby_qty: string;

    /**
     * 사모 펀드 순매수 거래량
     */
    @ApiProperty({
        description: '사모 펀드 순매수 거래량',
    })
    pe_fund_ntby_vol: string;

    /**
     * 은행 순매수 수량
     */
    @ApiProperty({
        description: '은행 순매수 수량',
    })
    bank_ntby_qty: string;

    /**
     * 보험 순매수 수량
     */
    @ApiProperty({
        description: '보험 순매수 수량',
    })
    insu_ntby_qty: string;

    /**
     * 종금 순매수 수량
     */
    @ApiProperty({
        description: '종금 순매수 수량',
    })
    mrbn_ntby_qty: string;

    /**
     * 기금 순매수 수량
     */
    @ApiProperty({
        description: '기금 순매수 수량',
    })
    fund_ntby_qty: string;

    /**
     * 기타 순매수 수량
     */
    @ApiProperty({
        description: '기타 순매수 수량',
    })
    etc_ntby_qty: string;

    /**
     * 기타 법인 순매수 거래량
     */
    @ApiProperty({
        description: '기타 법인 순매수 거래량',
    })
    etc_corp_ntby_vol: string;

    /**
     * 기타 단체 순매수 거래량
     */
    @ApiProperty({
        description: '기타 단체 순매수 거래량',
    })
    etc_orgt_ntby_vol: string;

    /**
     * 외국인 등록 순매수 대금
     */
    @ApiProperty({
        description: '외국인 등록 순매수 대금',
    })
    frgn_reg_ntby_pbmn: string;

    /**
     * 외국인 순매수 거래 대금
     */
    @ApiProperty({
        description: '외국인 순매수 거래 대금',
    })
    frgn_ntby_tr_pbmn: string;

    /**
     * 외국인 비등록 순매수 대금
     */
    @ApiProperty({
        description: '외국인 비등록 순매수 대금',
    })
    frgn_nreg_ntby_pbmn: string;

    /**
     * 개인 순매수 거래 대금
     */
    @ApiProperty({
        description: '개인 순매수 거래 대금',
    })
    prsn_ntby_tr_pbmn: string;

    /**
     * 기관계 순매수 거래 대금
     */
    @ApiProperty({
        description: '기관계 순매수 거래 대금',
    })
    orgn_ntby_tr_pbmn: string;

    /**
     * 증권 순매수 거래 대금
     */
    @ApiProperty({
        description: '증권 순매수 거래 대금',
    })
    scrt_ntby_tr_pbmn: string;

    /**
     * 사모 펀드 순매수 거래 대금
     */
    @ApiProperty({
        description: '사모 펀드 순매수 거래 대금',
    })
    pe_fund_ntby_tr_pbmn: string;

    /**
     * 투자신탁 순매수 거래 대금
     */
    @ApiProperty({
        description: '투자신탁 순매수 거래 대금',
    })
    ivtr_ntby_tr_pbmn: string;

    /**
     * 은행 순매수 거래 대금
     */
    @ApiProperty({
        description: '은행 순매수 거래 대금',
    })
    bank_ntby_tr_pbmn: string;

    /**
     * 보험 순매수 거래 대금
     */
    @ApiProperty({
        description: '보험 순매수 거래 대금',
    })
    insu_ntby_tr_pbmn: string;

    /**
     * 종금 순매수 거래 대금
     */
    @ApiProperty({
        description: '종금 순매수 거래 대금',
    })
    mrbn_ntby_tr_pbmn: string;

    /**
     * 기금 순매수 거래 대금
     */
    @ApiProperty({
        description: '기금 순매수 거래 대금',
    })
    fund_ntby_tr_pbmn: string;

    /**
     * 기타 순매수 거래 대금
     */
    @ApiProperty({
        description: '기타 순매수 거래 대금',
    })
    etc_ntby_tr_pbmn: string;

    /**
     * 기타 법인 순매수 거래 대금
     */
    @ApiProperty({
        description: '기타 법인 순매수 거래 대금',
    })
    etc_corp_ntby_tr_pbmn: string;

    /**
     * 기타 단체 순매수 거래 대금
     */
    @ApiProperty({
        description: '기타 단체 순매수 거래 대금',
    })
    etc_orgt_ntby_tr_pbmn: string;

    /**
     * 외국인 매도 거래량
     */
    @ApiProperty({
        description: '외국인 매도 거래량',
    })
    frgn_seln_vol: string;

    /**
     * 외국인 매수 거래량
     */
    @ApiProperty({
        description: '외국인 매수 거래량',
    })
    frgn_shnu_vol: string;

    /**
     * 외국인 매도 거래 대금
     */
    @ApiProperty({
        description: '외국인 매도 거래 대금',
    })
    frgn_seln_tr_pbmn: string;

    /**
     * 외국인 매수 거래 대금
     */
    @ApiProperty({
        description: '외국인 매수 거래 대금',
    })
    frgn_shnu_tr_pbmn: string;

    /**
     * 외국인 등록 매도 수량
     */
    @ApiProperty({
        description: '외국인 등록 매도 수량',
    })
    frgn_reg_askp_qty: string;

    /**
     * 외국인 등록 매수 수량
     */
    @ApiProperty({
        description: '외국인 등록 매수 수량',
    })
    frgn_reg_bidp_qty: string;

    /**
     * 외국인 등록 매도 대금
     */
    @ApiProperty({
        description: '외국인 등록 매도 대금',
    })
    frgn_reg_askp_pbmn: string;

    /**
     * 외국인 등록 매수 대금
     */
    @ApiProperty({
        description: '외국인 등록 매수 대금',
    })
    frgn_reg_bidp_pbmn: string;

    /**
     * 외국인 비등록 매도 수량
     */
    @ApiProperty({
        description: '외국인 비등록 매도 수량',
    })
    frgn_nreg_askp_qty: string;

    /**
     * 외국인 비등록 매수 수량
     */
    @ApiProperty({
        description: '외국인 비등록 매수 수량',
    })
    frgn_nreg_bidp_qty: string;

    /**
     * 외국인 비등록 매도 대금
     */
    @ApiProperty({
        description: '외국인 비등록 매도 대금',
    })
    frgn_nreg_askp_pbmn: string;

    /**
     * 외국인 비등록 매수 대금
     */
    @ApiProperty({
        description: '외국인 비등록 매수 대금',
    })
    frgn_nreg_bidp_pbmn: string;

    /**
     * 개인 매도 거래량
     */
    @ApiProperty({
        description: '개인 매도 거래량',
    })
    prsn_seln_vol: string;

    /**
     * 개인 매수 거래량
     */
    @ApiProperty({
        description: '개인 매수 거래량',
    })
    prsn_shnu_vol: string;

    /**
     * 개인 매도 거래 대금
     */
    @ApiProperty({
        description: '개인 매도 거래 대금',
    })
    prsn_seln_tr_pbmn: string;

    /**
     * 개인 매수 거래 대금
     */
    @ApiProperty({
        description: '개인 매수 거래 대금',
    })
    prsn_shnu_tr_pbmn: string;

    /**
     * 기관계 매도 거래량
     */
    @ApiProperty({
        description: '기관계 매도 거래량',
    })
    orgn_seln_vol: string;

    /**
     * 기관계 매수 거래량
     */
    @ApiProperty({
        description: '기관계 매수 거래량',
    })
    orgn_shnu_vol: string;

    /**
     * 기관계 매도 거래 대금
     */
    @ApiProperty({
        description: '기관계 매도 거래 대금',
    })
    orgn_seln_tr_pbmn: string;

    /**
     * 기관계 매수 거래 대금
     */
    @ApiProperty({
        description: '기관계 매수 거래 대금',
    })
    orgn_shnu_tr_pbmn: string;

    /**
     * 증권 매도 거래량
     */
    @ApiProperty({
        description: '증권 매도 거래량',
    })
    scrt_seln_vol: string;

    /**
     * 증권 매수 거래량
     */
    @ApiProperty({
        description: '증권 매수 거래량',
    })
    scrt_shnu_vol: string;

    /**
     * 증권 매도 거래 대금
     */
    @ApiProperty({
        description: '증권 매도 거래 대금',
    })
    scrt_seln_tr_pbmn: string;

    /**
     * 증권 매수 거래 대금
     */
    @ApiProperty({
        description: '증권 매수 거래 대금',
    })
    scrt_shnu_tr_pbmn: string;

    /**
     * 투자신탁 매도 거래량
     */
    @ApiProperty({
        description: '투자신탁 매도 거래량',
    })
    ivtr_seln_vol: string;

    /**
     * 투자신탁 매수 거래량
     */
    @ApiProperty({
        description: '투자신탁 매수 거래량',
    })
    ivtr_shnu_vol: string;

    /**
     * 투자신탁 매도 거래 대금
     */
    @ApiProperty({
        description: '투자신탁 매도 거래 대금',
    })
    ivtr_seln_tr_pbmn: string;

    /**
     * 투자신탁 매수 거래 대금
     */
    @ApiProperty({
        description: '투자신탁 매수 거래 대금',
    })
    ivtr_shnu_tr_pbmn: string;

    /**
     * 사모 펀드 매도 거래 대금
     */
    @ApiProperty({
        description: '사모 펀드 매도 거래 대금',
    })
    pe_fund_seln_tr_pbmn: string;

    /**
     * 사모 펀드 매도 거래량
     */
    @ApiProperty({
        description: '사모 펀드 매도 거래량',
    })
    pe_fund_seln_vol: string;

    /**
     * 사모 펀드 매수 거래 대금
     */
    @ApiProperty({
        description: '사모 펀드 매수 거래 대금',
    })
    pe_fund_shnu_tr_pbmn: string;

    /**
     * 사모 펀드 매수 거래량
     */
    @ApiProperty({
        description: '사모 펀드 매수 거래량',
    })
    pe_fund_shnu_vol: string;

    /**
     * 은행 매도 거래량
     */
    @ApiProperty({
        description: '은행 매도 거래량',
    })
    bank_seln_vol: string;

    /**
     * 은행 매수 거래량
     */
    @ApiProperty({
        description: '은행 매수 거래량',
    })
    bank_shnu_vol: string;

    /**
     * 은행 매도 거래 대금
     */
    @ApiProperty({
        description: '은행 매도 거래 대금',
    })
    bank_seln_tr_pbmn: string;

    /**
     * 은행 매수 거래 대금
     */
    @ApiProperty({
        description: '은행 매수 거래 대금',
    })
    bank_shnu_tr_pbmn: string;

    /**
     * 보험 매도 거래량
     */
    @ApiProperty({
        description: '보험 매도 거래량',
    })
    insu_seln_vol: string;

    /**
     * 보험 매수 거래량
     */
    @ApiProperty({
        description: '보험 매수 거래량',
    })
    insu_shnu_vol: string;

    /**
     * 보험 매도 거래 대금
     */
    @ApiProperty({
        description: '보험 매도 거래 대금',
    })
    insu_seln_tr_pbmn: string;

    /**
     * 보험 매수 거래 대금
     */
    @ApiProperty({
        description: '보험 매수 거래 대금',
    })
    insu_shnu_tr_pbmn: string;

    /**
     * 종금 매도 거래량
     */
    @ApiProperty({
        description: '종금 매도 거래량',
    })
    mrbn_seln_vol: string;

    /**
     * 종금 매수 거래량
     */
    @ApiProperty({
        description: '종금 매수 거래량',
    })
    mrbn_shnu_vol: string;

    /**
     * 종금 매도 거래 대금
     */
    @ApiProperty({
        description: '종금 매도 거래 대금',
    })
    mrbn_seln_tr_pbmn: string;

    /**
     * 종금 매수 거래 대금
     */
    @ApiProperty({
        description: '종금 매수 거래 대금',
    })
    mrbn_shnu_tr_pbmn: string;

    /**
     * 기금 매도 거래량
     */
    @ApiProperty({
        description: '기금 매도 거래량',
    })
    fund_seln_vol: string;

    /**
     * 기금 매수 거래량
     */
    @ApiProperty({
        description: '기금 매수 거래량',
    })
    fund_shnu_vol: string;

    /**
     * 기금 매도 거래 대금
     */
    @ApiProperty({
        description: '기금 매도 거래 대금',
    })
    fund_seln_tr_pbmn: string;

    /**
     * 기금 매수 거래 대금
     */
    @ApiProperty({
        description: '기금 매수 거래 대금',
    })
    fund_shnu_tr_pbmn: string;

    /**
     * 기타 매도 거래량
     */
    @ApiProperty({
        description: '기타 매도 거래량',
    })
    etc_seln_vol: string;

    /**
     * 기타 매수 거래량
     */
    @ApiProperty({
        description: '기타 매수 거래량',
    })
    etc_shnu_vol: string;

    /**
     * 기타 매도 거래 대금
     */
    @ApiProperty({
        description: '기타 매도 거래 대금',
    })
    etc_seln_tr_pbmn: string;

    /**
     * 기타 매수 거래 대금
     */
    @ApiProperty({
        description: '기타 매수 거래 대금',
    })
    etc_shnu_tr_pbmn: string;

    /**
     * 기타 단체 매도 거래량
     */
    @ApiProperty({
        description: '기타 단체 매도 거래량',
    })
    etc_orgt_seln_vol: string;

    /**
     * 기타 단체 매수 거래량
     */
    @ApiProperty({
        description: '기타 단체 매수 거래량',
    })
    etc_orgt_shnu_vol: string;

    /**
     * 기타 단체 매도 거래 대금
     */
    @ApiProperty({
        description: '기타 단체 매도 거래 대금',
    })
    etc_orgt_seln_tr_pbmn: string;

    /**
     * 기타 단체 매수 거래 대금
     */
    @ApiProperty({
        description: '기타 단체 매수 거래 대금',
    })
    etc_orgt_shnu_tr_pbmn: string;

    /**
     * 기타 법인 매도 거래량
     */
    @ApiProperty({
        description: '기타 법인 매도 거래량',
    })
    etc_corp_seln_vol: string;

    /**
     * 기타 법인 매수 거래량
     */
    @ApiProperty({
        description: '기타 법인 매수 거래량',
    })
    etc_corp_shnu_vol: string;

    /**
     * 기타 법인 매도 거래 대금
     */
    @ApiProperty({
        description: '기타 법인 매도 거래 대금',
    })
    etc_corp_seln_tr_pbmn: string;

    /**
     * 기타 법인 매수 거래 대금
     */
    @ApiProperty({
        description: '기타 법인 매수 거래 대금',
    })
    etc_corp_shnu_tr_pbmn: string;

    /**
     * BOLD 여부
     */
    @ApiProperty({
        description: 'BOLD 여부',
    })
    bold_yn: string;
}

export interface DomesticInvestorTrendEstimateParam {
    /**
     * 종목코드 (6자리)
     */
    MKSC_SHRN_ISCD: string;
}

export class DomesticInvestorTrendEstimateOutput2 {
    /**
     * 입력구분
     * 1:09:30
     * 2:10:00
     * 3:11:20
     * 4:13:20
     * 5:14:30
     */
    @ApiProperty({
        description: '입력구분\n1:09:30\n2:10:00\n3:11:20\n4:13:20\n5:14:30',
    })
    bsop_hour_gb: string;

    /**
     * 외국인수량(가집계)
     */
    @ApiProperty({
        description: '외국인수량(가집계)',
    })
    frgn_fake_ntby_qty: string;

    /**
     * 기관수량(가집계)
     */
    @ApiProperty({
        description: '기관수량(가집계)',
    })
    orgn_fake_ntby_qty: string;

    /**
     * 합산수량(가집계)
     */
    @ApiProperty({
        description: '합산수량(가집계)',
    })
    sum_fake_ntby_qty: string;
}

export interface KoreaInvestmentInterestGroupListParam {
    /**
     * 관심종목구분코드
     * Unique key(1)
     */
    TYPE: string;

    /**
     * FID 기타 구분 코드
     * Unique key(00)
     */
    FID_ETC_CLS_CODE: string;

    /**
     * 사용자 ID
     * 사용자의 HTS_ID 입력
     */
    USER_ID: string;
}

export class KoreaInvestmentInterestGroupListOutput {
    @ApiProperty({
        description: '일자',
    })
    date: string;

    @ApiProperty({
        description: '전송 시간',
    })
    trnm_hour: string;

    @ApiProperty({
        description: '데이터 순위',
    })
    data_rank: string;

    @ApiProperty({
        description: '관심 그룹 코드',
    })
    inter_grp_code: string;

    @ApiProperty({
        description: '관심 그룹 명',
    })
    inter_grp_name: string;

    @ApiProperty({
        description: '요청 개수',
    })
    ask_cnt: string;
}

export interface KoreaInvestmentInterestStockListByGroupParam {
    /**
     * 관심종목구분코드
     * Unique key(1)
     */
    TYPE: string;

    /**
     * 사용자 ID
     * 사용자의 HTS_ID 입력
     */
    USER_ID: string;

    /**
     * 데이터 순위
     * 공백 입력
     */
    DATA_RANK: string;

    /**
     * 관심 그룹 코드
     * 관심그룹 조회 결과의 그룹 값(inter_grp_code) 입력
     */
    INTER_GRP_CODE: string;

    /**
     * 관심 그룹 명
     * 공백 입력
     */
    INTER_GRP_NAME: string;

    /**
     * HTS 한글 종목명
     * 공백 입력
     */
    HTS_KOR_ISNM: string;

    /**
     * 체결 구분 코드
     * 공백 입력
     */
    CNTG_CLS_CODE: string;

    /**
     * 기타 구분 코드
     * Unique key(4)
     */
    FID_ETC_CLS_CODE: string;
}

export class KoreaInvestmentInterestStockListByGroupOutput {
    @ApiProperty({
        description: '데이터 순위',
    })
    data_rank: string;

    @ApiProperty({
        description: '관심 그룹 명',
    })
    inter_grp_name: string;
}

export class KoreaInvestmentInterestStockListByGroupOutput2 {
    @ApiProperty({
        description: 'FID 시장 구분 코드',
    })
    fid_mrkt_cls_code: string;

    @ApiProperty({
        description: '데이터 순위',
    })
    data_rank: string;

    @ApiProperty({
        description: '거래소코드',
    })
    exch_code: string;

    @ApiProperty({
        description: '종목코드',
    })
    jong_code: string;

    @ApiProperty({
        description: '색상 코드',
    })
    color_code: string;

    @ApiProperty({
        description: '메모',
    })
    memo: string;

    @ApiProperty({
        description: 'HTS 한글 종목명',
    })
    hts_kor_isnm: string;

    @ApiProperty({
        description: '기준일 순매수 수량',
    })
    fxdt_ntby_qty: string;

    @ApiProperty({
        description: '체결단가',
    })
    cntg_unpr: string;

    @ApiProperty({
        description: '체결 구분 코드',
    })
    cntg_cls_code: string;
}

/**
 * 주식현재가 일자별 Param
 */
export interface DomesticStockInquireDailyPriceParam {
    /**
     * 조건 시장 분류 코드
     * J:KRX, NX:NXT, UN:통합
     */
    FID_COND_MRKT_DIV_CODE: MarketDivCode;

    /**
     * 입력 종목코드
     * 종목코드 (ex 005930 삼성전자)
     */
    FID_INPUT_ISCD: string;

    /**
     * 기간 분류 코드
     * D : (일)최근 30거래일, W : (주)최근 30주, M : (월)최근 30개월
     */
    FID_PERIOD_DIV_CODE: PeriodType;

    /**
     * 수정주가 원주가 가격
     * 0 : 수정주가미반영, 1 : 수정주가반영
     */
    FID_ORG_ADJ_PRC: '0' | '1';
}

/**
 * 주식현재가 일자별 Output
 */
export class DomesticStockInquireDailyPriceOutput {
    /**
     * 주식 영업 일자
     */
    stck_bsop_date: string;

    /**
     * 주식 시가2
     */
    stck_oprc: string;

    /**
     * 주식 최고가
     */
    stck_hgpr: string;

    /**
     * 주식 최저가
     */
    stck_lwpr: string;

    /**
     * 주식 종가
     */
    stck_clpr: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 전일 대비 거래량 비율
     */
    prdy_vrss_vol_rate: string;

    /**
     * 전일 대비
     */
    prdy_vrss: string;

    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 전일 대비율
     */
    prdy_ctrt: string;

    /**
     * HTS 외국인 소진율
     */
    hts_frgn_ehrt: string;

    /**
     * 외국인 순매수 수량
     */
    frgn_ntby_qty: string;

    /**
     * 락 구분 코드
     * 01 : 권리락, 02 : 배당락, 03 : 분배락 등
     */
    flng_cls_code: string;

    /**
     * 누적 분할 비율
     */
    acml_prtt_rate: string;
}

export interface DomesticStockQuotationInquirePrice2Output {
    /**
     * 대표 시장 한글 명
     */
    rprs_mrkt_kor_name: string;

    /**
     * 신 고가 저가 구분 코드	특정 경우에만 데이터 출력
     */
    new_hgpr_lwpr_cls_code: string;

    /**
     * 상하한가 구분 코드	특정 경우에만 데이터 출력
     */
    mxpr_llam_cls_code: string;

    /**
     * 신용 가능 여부
     */
    crdt_able_yn: string;

    /**
     * 주식 상한가
     */
    stck_mxpr: string;

    /**
     * ELW 발행 여부
     */
    elw_pblc_yn: string;

    /**
     * 전일 종가 대비 시가2 비율
     */
    prdy_clpr_vrss_oprc_rate: string;

    /**
     * 신용 비율
     */
    crdt_rate: string;

    /**
     * 증거금 비율
     */
    marg_rate: string;

    /**
     * 최저가 대비 현재가
     */
    lwpr_vrss_prpr: string;

    /**
     * 최저가 대비 현재가 부호
     */
    lwpr_vrss_prpr_sign: string;

    /**
     * 전일 종가 대비 최저가 비율
     */
    prdy_clpr_vrss_lwpr_rate: string;

    /**
     * 주식 최저가
     */
    stck_lwpr: string;

    /**
     * 최고가 대비 현재가
     */
    hgpr_vrss_prpr: string;

    /**
     * 최고가 대비 현재가 부호
     */
    hgpr_vrss_prpr_sign: string;

    /**
     * 전일 종가 대비 최고가 비율
     */
    prdy_clpr_vrss_hgpr_rate: string;

    /**
     * 주식 최고가
     */
    stck_hgpr: string;

    /**
     * 시가2 대비 현재가
     */
    oprc_vrss_prpr: string;

    /**
     * 시가2 대비 현재가 부호
     */
    oprc_vrss_prpr_sign: string;

    /**
     * 관리 종목 여부
     */
    mang_issu_yn: string;

    /**
     * 동시호가배분처리코드	11:매수상한배분 12:매수하한배분 13: 매도상한배분 14:매도하한배분
     */
    divi_app_cls_code: string;

    /**
     * 단기과열여부
     */
    short_over_yn: string;

    /**
     * 시장경고코드	00: 없음 01: 투자주의 02:투자경고 03:투자위험
     */
    mrkt_warn_cls_code: string;

    /**
     * 투자유의여부
     */
    invt_caful_yn: string;

    /**
     * 이상급등여부
     */
    stange_runup_yn: string;

    /**
     * 공매도과열 여부
     */
    ssts_hot_yn: string;

    /**
     * 저유동성 종목 여부
     */
    low_current_yn: string;

    /**
     * VI적용구분코드
     */
    vi_cls_code: string;

    /**
     * 단기과열구분코드
     */
    short_over_cls_code: string;

    /**
     * 주식 하한가
     */
    stck_llam: string;

    /**
     * 신규 상장 구분 명
     */
    new_lstn_cls_name: string;

    /**
     * 임의 매매 구분 명
     */
    vlnt_deal_cls_name: string;

    /**
     * 락 구분 이름	특정 경우에만 데이터 출력
     */
    flng_cls_name: string;

    /**
     * 재평가 종목 사유 명	특정 경우에만 데이터 출력
     */
    revl_issu_reas_name: string;

    /**
     * 시장 경고 구분 명	특정 경우에만 데이터 출력"투자환기" / "투자경고"
     */
    mrkt_warn_cls_name: string;

    /**
     * 주식 기준가
     */
    stck_sdpr: string;

    /**
     * 업종 구분 코드
     */
    bstp_cls_code: string;

    /**
     * 주식 전일 종가
     */
    stck_prdy_clpr: string;

    /**
     * 불성실 공시 여부
     */
    insn_pbnt_yn: string;

    /**
     * 액면가 변경 구분 명	특정 경우에만 데이터 출력
     */
    fcam_mod_cls_name: string;

    /**
     * 주식 현재가
     */
    stck_prpr: string;

    /**
     * 전일 대비
     */
    prdy_vrss: string;

    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 전일 대비율
     */
    prdy_ctrt: string;

    /**
     * 누적 거래 대금
     */
    acml_tr_pbmn: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 전일 대비 거래량 비율
     */
    prdy_vrss_vol_rate: string;

    /**
     * 업종 한글 종목명	※ 거래소 정보로 특정 종목은 업종구분이 없어 데이터 미회신
     */
    bstp_kor_isnm: string;

    /**
     * 정리매매 여부
     */
    sltr_yn: string;

    /**
     * 거래정지 여부
     */
    trht_yn: string;

    /**
     * 시가 범위 연장 여부
     */
    oprc_rang_cont_yn: string;

    /**
     * 임의 종료 구분 코드
     */
    vlnt_fin_cls_code: string;

    /**
     * 주식 시가2
     */
    stck_oprc: string;

    /**
     * 전일 거래량
     */
    prdy_vol: string;
}

export interface DomesticStockQuotationInquireCcnlOutput {
    /**
     * 주식 체결 시간
     */
    stck_cntg_hour: string;

    /**
     * 주식 현재가
     */
    stck_prpr: string;

    /**
     * 전일 대비
     */
    prdy_vrss: string;

    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 체결 거래량
     */
    cntg_vol: string;

    /**
     * 당일 체결강도
     */
    tday_rltv: string;

    /**
     * 전일 대비율
     */
    prdy_ctrt: string;
}

export interface DomesticStockQuotationInquireIndexPriceParam {
    /**
     * FID 조건 시장 분류 코드
     */
    FID_COND_MRKT_DIV_CODE: string;

    /**
     * FID 입력 종목코드
     */
    FID_INPUT_ISCD: string;
}

export interface DomesticStockQuotationInquireIndexPriceOutput {
    /**
     * 업종 지수 현재가
     */
    bstp_nmix_prpr: string;

    /**
     * 업종 지수 전일 대비
     */
    bstp_nmix_prdy_vrss: string;

    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 업종 지수 전일 대비율
     */
    bstp_nmix_prdy_ctrt: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 전일 거래량
     */
    prdy_vol: string;

    /**
     * 누적 거래 대금
     */
    acml_tr_pbmn: string;

    /**
     * 전일 거래 대금
     */
    prdy_tr_pbmn: string;

    /**
     * 업종 지수 시가2
     */
    bstp_nmix_oprc: string;

    /**
     * 전일 지수 대비 지수 시가2
     */
    prdy_nmix_vrss_nmix_oprc: string;

    /**
     * 시가2 대비 현재가 부호
     */
    oprc_vrss_prpr_sign: string;

    /**
     * 업종 지수 시가2 전일 대비율
     */
    bstp_nmix_oprc_prdy_ctrt: string;

    /**
     * 업종 지수 최고가
     */
    bstp_nmix_hgpr: string;

    /**
     * 전일 지수 대비 지수 최고가
     */
    prdy_nmix_vrss_nmix_hgpr: string;

    /**
     * 최고가 대비 현재가 부호
     */
    hgpr_vrss_prpr_sign: string;

    /**
     * 업종 지수 최고가 전일 대비율
     */
    bstp_nmix_hgpr_prdy_ctrt: string;

    /**
     * 업종 지수 최저가
     */
    bstp_nmix_lwpr: string;

    /**
     * 전일 종가 대비 최저가
     */
    prdy_clpr_vrss_lwpr: string;

    /**
     * 최저가 대비 현재가 부호
     */
    lwpr_vrss_prpr_sign: string;

    /**
     * 전일 종가 대비 최저가 비율
     */
    prdy_clpr_vrss_lwpr_rate: string;

    /**
     * 상승 종목 수
     */
    ascn_issu_cnt: string;

    /**
     * 상한 종목 수
     */
    uplm_issu_cnt: string;

    /**
     * 보합 종목 수
     */
    stnr_issu_cnt: string;

    /**
     * 하락 종목 수
     */
    down_issu_cnt: string;

    /**
     * 하한 종목 수
     */
    lslm_issu_cnt: string;

    /**
     * 연중업종지수최고가
     */
    dryy_bstp_nmix_hgpr: string;

    /**
     * 연중 최고가 대비 현재가 비율
     */
    dryy_hgpr_vrss_prpr_rate: string;

    /**
     * 연중업종지수최고가일자
     */
    dryy_bstp_nmix_hgpr_date: string;

    /**
     * 연중업종지수최저가
     */
    dryy_bstp_nmix_lwpr: string;

    /**
     * 연중 최저가 대비 현재가 비율
     */
    dryy_lwpr_vrss_prpr_rate: string;

    /**
     * 연중업종지수최저가일자
     */
    dryy_bstp_nmix_lwpr_date: string;

    /**
     * 총 매도호가 잔량
     */
    total_askp_rsqn: string;

    /**
     * 총 매수호가 잔량
     */
    total_bidp_rsqn: string;

    /**
     * 매도 잔량 비율
     */
    seln_rsqn_rate: string;

    /**
     * 매수2 잔량 비율
     */
    shnu_rsqn_rate: string;

    /**
     * 순매수 잔량
     */
    ntby_rsqn: string;
}

export interface DomesticStockQuotationsInquireTimeItemChartPriceOutput {
    /**
     * 전일 대비
     * 전일 대비 변동 (+-변동차이)
     */
    prdy_vrss: string;

    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 전일 대비율
     * 소수점 두자리까지 제공
     */
    prdy_ctrt: string;

    /**
     * 전일대비 종가
     */
    stck_prdy_clpr: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 누적 거래대금
     */
    acml_tr_pbmn: string;

    /**
     * 한글 종목명
     * 한글 종목명 (HTS 기준)
     */
    hts_kor_isnm: string;

    /**
     * 주식 현재가
     */
    stck_prpr: string;
}

export interface DomesticStockQuotationsInquireTimeItemChartPriceOutput2 {
    /**
     * 주식 영업일자
     */
    stck_bsop_date: string;

    /**
     * 주식 체결시간
     */
    stck_cntg_hour: string;

    /**
     * 주식 현재가
     */
    stck_prpr: string;

    /**
     * 주식 시가
     */
    stck_oprc: string;

    /**
     * 주식 최고가
     */
    stck_hgpr: string;

    /**
     * 주식 최저가
     */
    stck_lwpr: string;

    /**
     * 체결 거래량
     */
    cntg_vol: string;

    /**
     * 누적 거래대금
     */
    acml_tr_pbmn: string;
}

export interface DomesticStockQuotationsInquireIndexTimePriceOutput {
    /**
     * 영업 시간
     */
    bsop_hour: string;

    /**
     * 업종 지수 현재가
     */
    bstp_nmix_prpr: string;

    /**
     * 업종 지수 전일 대비
     */
    bstp_nmix_prdy_vrss: string;

    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 업종 지수 전일 대비율
     */
    bstp_nmix_prdy_ctrt: string;

    /**
     * 누적 거래 대금
     */
    acml_tr_pbmn: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 체결 거래량
     */
    cntg_vol: string;
}

export interface DomesticStockQuotationsInquireIndexDailyPriceParam {
    /**
     * FID 기간 분류 코드 - 일/주/월 구분코드 ( D:일별 , W:주별, M:월별 )
     */
    FID_PERIOD_DIV_CODE: string;

    /**
     * FID 조건 시장 분류 코드 - 시장구분코드 (업종 U)
     */
    FID_COND_MRKT_DIV_CODE: string;

    /**
     * FID 입력 종목코드 - 코스피(0001), 코스닥(1001), 코스피200(2001) ... 포탈 (FAQ : 종목정보 다운로드(국내) - 업종코드 참조)
     */
    FID_INPUT_ISCD: string;

    /**
     * FID 입력 날짜1 - 입력 날짜(ex. 20240223)
     */
    FID_INPUT_DATE_1: string;
}

export interface DomesticStockQuotationsInquireIndexDailyPriceOutput {
    /**
     * 업종 지수 현재가
     */
    bstp_nmix_prpr: string;

    /**
     * 업종 지수 전일 대비
     */
    bstp_nmix_prdy_vrss: string;

    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 업종 지수 전일 대비율
     */
    bstp_nmix_prdy_ctrt: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 누적 거래 대금
     */
    acml_tr_pbmn: string;

    /**
     * 업종 지수 시가2
     */
    bstp_nmix_oprc: string;

    /**
     * 업종 지수 최고가
     */
    bstp_nmix_hgpr: string;

    /**
     * 업종 지수 최저가
     */
    bstp_nmix_lwpr: string;

    /**
     * 전일 거래량
     */
    prdy_vol: string;

    /**
     * 상승 종목 수
     */
    ascn_issu_cnt: string;

    /**
     * 하락 종목 수
     */
    down_issu_cnt: string;

    /**
     * 보합 종목 수
     */
    stnr_issu_cnt: string;

    /**
     * 상한 종목 수
     */
    uplm_issu_cnt: string;

    /**
     * 하한 종목 수
     */
    lslm_issu_cnt: string;

    /**
     * 전일 거래 대금
     */
    prdy_tr_pbmn: string;

    /**
     * 연중업종지수최고가일자
     */
    dryy_bstp_nmix_hgpr_date: string;

    /**
     * 연중업종지수최고가
     */
    dryy_bstp_nmix_hgpr: string;

    /**
     * 연중업종지수최저가
     */
    dryy_bstp_nmix_lwpr: string;

    /**
     * 연중업종지수최저가일자
     */
    dryy_bstp_nmix_lwpr_date: string;
}

export interface DomesticStockQuotationsInquireIndexDailyPriceOutput2 {
    /**
     * 주식 영업 일자
     */
    stck_bsop_date: string;

    /**
     * 업종 지수 현재가
     */
    bstp_nmix_prpr: string;

    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 업종 지수 전일 대비
     */
    bstp_nmix_prdy_vrss: string;

    /**
     * 업종 지수 전일 대비율
     */
    bstp_nmix_prdy_ctrt: string;

    /**
     * 업종 지수 시가2
     */
    bstp_nmix_oprc: string;

    /**
     * 업종 지수 최고가
     */
    bstp_nmix_hgpr: string;

    /**
     * 업종 지수 최저가
     */
    bstp_nmix_lwpr: string;

    /**
     * 누적 거래량 비중
     */
    acml_vol_rlim: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 누적 거래 대금
     */
    acml_tr_pbmn: string;

    /**
     * 투자 신 심리도
     */
    invt_new_psdg: string;

    /**
     * 20일 이격도
     */
    d20_dsrt: string;
}

export interface DomesticStockQuotationsInquireMemberParam {
    /**
     * FID 조건 시장 분류 코드
     * J:KRX, NX:NXT, UN:통합
     */
    FID_COND_MRKT_DIV_CODE: string;

    /**
     * FID 입력 종목코드
     * 종목번호 (6자리) ETN의 경우, Q로 시작 (EX. Q500001)
     */
    FID_INPUT_ISCD: string;
}

export interface DomesticStockQuotationsInquireMemberOutput {
    /**
     * 매도 회원사 번호1
     */
    seln_mbcr_no1: string;

    /**
     * 매도 회원사 번호2
     */
    seln_mbcr_no2: string;

    /**
     * 매도 회원사 번호3
     */
    seln_mbcr_no3: string;

    /**
     * 매도 회원사 번호4
     */
    seln_mbcr_no4: string;

    /**
     * 매도 회원사 번호5
     */
    seln_mbcr_no5: string;

    /**
     * 매도 회원사 명1
     */
    seln_mbcr_name1: string;

    /**
     * 매도 회원사 명2
     */
    seln_mbcr_name2: string;

    /**
     * 매도 회원사 명3
     */
    seln_mbcr_name3: string;

    /**
     * 매도 회원사 명4
     */
    seln_mbcr_name4: string;

    /**
     * 매도 회원사 명5
     */
    seln_mbcr_name5: string;

    /**
     * 총 매도 수량1
     */
    total_seln_qty1: string;

    /**
     * 총 매도 수량2
     */
    total_seln_qty2: string;

    /**
     * 총 매도 수량3
     */
    total_seln_qty3: string;

    /**
     * 총 매도 수량4
     */
    total_seln_qty4: string;

    /**
     * 총 매도 수량5
     */
    total_seln_qty5: string;

    /**
     * 매도 회원사 비중1
     */
    seln_mbcr_rlim1: string;

    /**
     * 매도 회원사 비중2
     */
    seln_mbcr_rlim2: string;

    /**
     * 매도 회원사 비중3
     */
    seln_mbcr_rlim3: string;

    /**
     * 매도 회원사 비중4
     */
    seln_mbcr_rlim4: string;

    /**
     * 매도 회원사 비중5
     */
    seln_mbcr_rlim5: string;

    /**
     * 매도 수량 증감1
     */
    seln_qty_icdc1: string;

    /**
     * 매도 수량 증감2
     */
    seln_qty_icdc2: string;

    /**
     * 매도 수량 증감3
     */
    seln_qty_icdc3: string;

    /**
     * 매도 수량 증감4
     */
    seln_qty_icdc4: string;

    /**
     * 매도 수량 증감5
     */
    seln_qty_icdc5: string;

    /**
     * 매수2 회원사 번호1
     */
    shnu_mbcr_no1: string;

    /**
     * 매수2 회원사 번호2
     */
    shnu_mbcr_no2: string;

    /**
     * 매수2 회원사 번호3
     */
    shnu_mbcr_no3: string;

    /**
     * 매수2 회원사 번호4
     */
    shnu_mbcr_no4: string;

    /**
     * 매수2 회원사 번호5
     */
    shnu_mbcr_no5: string;

    /**
     * 매수2 회원사 명1
     */
    shnu_mbcr_name1: string;

    /**
     * 매수2 회원사 명2
     */
    shnu_mbcr_name2: string;

    /**
     * 매수2 회원사 명3
     */
    shnu_mbcr_name3: string;

    /**
     * 매수2 회원사 명4
     */
    shnu_mbcr_name4: string;

    /**
     * 매수2 회원사 명5
     */
    shnu_mbcr_name5: string;

    /**
     * 총 매수2 수량1
     */
    total_shnu_qty1: string;

    /**
     * 총 매수2 수량2
     */
    total_shnu_qty2: string;

    /**
     * 총 매수2 수량3
     */
    total_shnu_qty3: string;

    /**
     * 총 매수2 수량4
     */
    total_shnu_qty4: string;

    /**
     * 총 매수2 수량5
     */
    total_shnu_qty5: string;

    /**
     * 매수2 회원사 비중1
     */
    shnu_mbcr_rlim1: string;

    /**
     * 매수2 회원사 비중2
     */
    shnu_mbcr_rlim2: string;

    /**
     * 매수2 회원사 비중3
     */
    shnu_mbcr_rlim3: string;

    /**
     * 매수2 회원사 비중4
     */
    shnu_mbcr_rlim4: string;

    /**
     * 매수2 회원사 비중5
     */
    shnu_mbcr_rlim5: string;

    /**
     * 매수2 수량 증감1
     */
    shnu_qty_icdc1: string;

    /**
     * 매수2 수량 증감2
     */
    shnu_qty_icdc2: string;

    /**
     * 매수2 수량 증감3
     */
    shnu_qty_icdc3: string;

    /**
     * 매수2 수량 증감4
     */
    shnu_qty_icdc4: string;

    /**
     * 매수2 수량 증감5
     */
    shnu_qty_icdc5: string;

    /**
     * 외국계 총 매도 수량
     */
    glob_total_seln_qty: string;

    /**
     * 외국계 매도 비중
     */
    glob_seln_rlim: string;

    /**
     * 외국계 순매수 수량
     */
    glob_ntby_qty: string;

    /**
     * 외국계 총 매수2 수량
     */
    glob_total_shnu_qty: string;

    /**
     * 외국계 매수2 비중
     */
    glob_shnu_rlim: string;

    /**
     * 매도 회원사 외국계 여부1
     */
    seln_mbcr_glob_yn_1: string;

    /**
     * 매도 회원사 외국계 여부2
     */
    seln_mbcr_glob_yn_2: string;

    /**
     * 매도 회원사 외국계 여부3
     */
    seln_mbcr_glob_yn_3: string;

    /**
     * 매도 회원사 외국계 여부4
     */
    seln_mbcr_glob_yn_4: string;

    /**
     * 매도 회원사 외국계 여부5
     */
    seln_mbcr_glob_yn_5: string;

    /**
     * 매수2 회원사 외국계 여부1
     */
    shnu_mbcr_glob_yn_1: string;

    /**
     * 매수2 회원사 외국계 여부2
     */
    shnu_mbcr_glob_yn_2: string;

    /**
     * 매수2 회원사 외국계 여부3
     */
    shnu_mbcr_glob_yn_3: string;

    /**
     * 매수2 회원사 외국계 여부4
     */
    shnu_mbcr_glob_yn_4: string;

    /**
     * 매수2 회원사 외국계 여부5
     */
    shnu_mbcr_glob_yn_5: string;

    /**
     * 외국계 총 매도 수량 증감
     */
    glob_total_seln_qty_icdc: string;

    /**
     * 외국계 총 매수2 수량 증감
     */
    glob_total_shnu_qty_icdc: string;
}

export interface DomesticStockQuotationsNewsTitleParam {
    /**
     * 뉴스 제공 업체 코드 공백 필수 입력
     */
    FID_NEWS_OFER_ENTP_CODE: string;

    /**
     * 조건 시장 구분 코드 공백 필수 입력
     */
    FID_COND_MRKT_CLS_CODE: string;

    /**
     * 입력 종목코드 공백: 전체, 종목코드 : 해당코드가 등록된 뉴스
     */
    FID_INPUT_ISCD: string;

    /**
     * 제목 내용 공백 필수 입력
     */
    FID_TITL_CNTT: string;

    /**
     * 입력 날짜 공백: 현재기준, 조회일자(ex 00YYYYMMDD)
     */
    FID_INPUT_DATE_1: string;

    /**
     * 입력 시간 공백: 현재기준, 조회시간(ex 0000HHMMSS)
     */
    FID_INPUT_HOUR_1: string;

    /**
     * 순위 정렬 구분 코드 공백 필수 입력
     */
    FID_RANK_SORT_CLS_CODE: string;

    /**
     * 입력 일련번호 공백 필수 입력
     */
    FID_INPUT_SRNO: string;
}

export interface DomesticStockQuotationsNewsTitleOutput {
    /**
     * 내용 조회용 일련번호
     */
    cntt_usiq_srno: string;

    /**
     * 뉴스 제공 업체 코드
     */
    news_ofer_entp_code: string;

    /**
     * 작성일자
     */
    data_dt: string;

    /**
     * 작성시간
     */
    data_tm: string;

    /**
     * HTS 공시 제목 내용
     */
    hts_pbnt_titl_cntt: string;

    /**
     * 뉴스 대구분
     */
    news_lrdv_code: string;

    /**
     * 자료원
     */
    dorg: string;

    /**
     * 종목 코드1
     */
    iscd1: string;

    /**
     * 종목 코드2
     */
    iscd2: string;

    /**
     * 종목 코드3
     */
    iscd3: string;

    /**
     * 종목 코드4
     */
    iscd4: string;

    /**
     * 종목 코드5
     */
    iscd5: string;
}

export interface DomesticStockQuotationsIntstockMultPriceParam {
    /**
     * 조건 시장 분류 코드1
     * J: KRX
     * NX: NXT
     * UN: 통합
     */
    FID_COND_MRKT_DIV_CODE_1: string;

    /**
     * 입력 종목코드1
     * 그룹별종목조회 결과 jong_code(종목코드)
     */
    FID_INPUT_ISCD_1: string;

    /**
     * 조건 시장 분류 코드2
     */
    FID_COND_MRKT_DIV_CODE_2?: string;

    /**
     * 입력 종목코드2
     */
    FID_INPUT_ISCD_2?: string;

    /**
     * 조건 시장 분류 코드3
     */
    FID_COND_MRKT_DIV_CODE_3?: string;

    /**
     * 입력 종목코드3
     */
    FID_INPUT_ISCD_3?: string;

    /**
     * 조건 시장 분류 코드4
     */
    FID_COND_MRKT_DIV_CODE_4?: string;

    /**
     * 입력 종목코드4
     */
    FID_INPUT_ISCD_4?: string;

    /**
     * 조건 시장 분류 코드5
     */
    FID_COND_MRKT_DIV_CODE_5?: string;

    /**
     * 입력 종목코드5
     */
    FID_INPUT_ISCD_5?: string;

    /**
     * 조건 시장 분류 코드6
     */
    FID_COND_MRKT_DIV_CODE_6?: string;

    /**
     * 입력 종목코드6
     */
    FID_INPUT_ISCD_6?: string;

    /**
     * 조건 시장 분류 코드7
     */
    FID_COND_MRKT_DIV_CODE_7?: string;

    /**
     * 입력 종목코드7
     */
    FID_INPUT_ISCD_7?: string;

    /**
     * 조건 시장 분류 코드8
     */
    FID_COND_MRKT_DIV_CODE_8?: string;

    /**
     * 입력 종목코드8
     */
    FID_INPUT_ISCD_8?: string;

    /**
     * 조건 시장 분류 코드9
     */
    FID_COND_MRKT_DIV_CODE_9?: string;

    /**
     * 입력 종목코드9
     */
    FID_INPUT_ISCD_9?: string;

    /**
     * 조건 시장 분류 코드10
     */
    FID_COND_MRKT_DIV_CODE_10?: string;

    /**
     * 입력 종목코드10
     */
    FID_INPUT_ISCD_10?: string;

    /**
     * 조건 시장 분류 코드11
     */
    FID_COND_MRKT_DIV_CODE_11?: string;

    /**
     * 입력 종목코드11
     */
    FID_INPUT_ISCD_11?: string;

    /**
     * 조건 시장 분류 코드12
     */
    FID_COND_MRKT_DIV_CODE_12?: string;

    /**
     * 입력 종목코드12
     */
    FID_INPUT_ISCD_12?: string;

    /**
     * 조건 시장 분류 코드13
     */
    FID_COND_MRKT_DIV_CODE_13?: string;

    /**
     * 입력 종목코드13
     */
    FID_INPUT_ISCD_13?: string;

    /**
     * 조건 시장 분류 코드14
     */
    FID_COND_MRKT_DIV_CODE_14?: string;

    /**
     * 입력 종목코드14
     */
    FID_INPUT_ISCD_14?: string;

    /**
     * 조건 시장 분류 코드15
     */
    FID_COND_MRKT_DIV_CODE_15?: string;

    /**
     * 입력 종목코드15
     */
    FID_INPUT_ISCD_15?: string;

    /**
     * 조건 시장 분류 코드16
     */
    FID_COND_MRKT_DIV_CODE_16?: string;

    /**
     * 입력 종목코드16
     */
    FID_INPUT_ISCD_16?: string;

    /**
     * 조건 시장 분류 코드17
     */
    FID_COND_MRKT_DIV_CODE_17?: string;

    /**
     * 입력 종목코드17
     */
    FID_INPUT_ISCD_17?: string;

    /**
     * 조건 시장 분류 코드18
     */
    FID_COND_MRKT_DIV_CODE_18?: string;

    /**
     * 입력 종목코드18
     */
    FID_INPUT_ISCD_18?: string;

    /**
     * 조건 시장 분류 코드19
     */
    FID_COND_MRKT_DIV_CODE_19?: string;

    /**
     * 입력 종목코드19
     */
    FID_INPUT_ISCD_19?: string;

    /**
     * 조건 시장 분류 코드20
     */
    FID_COND_MRKT_DIV_CODE_20?: string;

    /**
     * 입력 종목코드20
     */
    FID_INPUT_ISCD_20?: string;

    /**
     * 조건 시장 분류 코드21
     */
    FID_COND_MRKT_DIV_CODE_21?: string;

    /**
     * 입력 종목코드21
     */
    FID_INPUT_ISCD_21?: string;

    /**
     * 조건 시장 분류 코드22
     */
    FID_COND_MRKT_DIV_CODE_22?: string;

    /**
     * 입력 종목코드22
     */
    FID_INPUT_ISCD_22?: string;

    /**
     * 조건 시장 분류 코드23
     */
    FID_COND_MRKT_DIV_CODE_23?: string;

    /**
     * 입력 종목코드23
     */
    FID_INPUT_ISCD_23?: string;

    /**
     * 조건 시장 분류 코드24
     */
    FID_COND_MRKT_DIV_CODE_24?: string;

    /**
     * 입력 종목코드24
     */
    FID_INPUT_ISCD_24?: string;

    /**
     * 조건 시장 분류 코드25
     */
    FID_COND_MRKT_DIV_CODE_25?: string;

    /**
     * 입력 종목코드25
     */
    FID_INPUT_ISCD_25?: string;

    /**
     * 조건 시장 분류 코드26
     */
    FID_COND_MRKT_DIV_CODE_26?: string;

    /**
     * 입력 종목코드26
     */
    FID_INPUT_ISCD_26?: string;

    /**
     * 조건 시장 분류 코드27
     */
    FID_COND_MRKT_DIV_CODE_27?: string;

    /**
     * 입력 종목코드27
     */
    FID_INPUT_ISCD_27?: string;

    /**
     * 조건 시장 분류 코드28
     */
    FID_COND_MRKT_DIV_CODE_28?: string;

    /**
     * 입력 종목코드28
     */
    FID_INPUT_ISCD_28?: string;

    /**
     * 조건 시장 분류 코드29
     */
    FID_COND_MRKT_DIV_CODE_29?: string;

    /**
     * 입력 종목코드29
     */
    FID_INPUT_ISCD_29?: string;

    /**
     * 조건 시장 분류 코드30
     */
    FID_COND_MRKT_DIV_CODE_30?: string;

    /**
     * 입력 종목코드30
     */
    FID_INPUT_ISCD_30?: string;
}

export interface DomesticStockQuotationsIntstockMultPriceOutput {
    /**
     * 코스피 코스닥 구분 명
     */
    kospi_kosdaq_cls_name: string;

    /**
     * 시장 조치 구분 명
     */
    mrkt_trtm_cls_name: string;

    /**
     * 시간 구분 코드
     */
    hour_cls_code: string;

    /**
     * 관심 단축 종목코드
     */
    inter_shrn_iscd: string;

    /**
     * 관심 한글 종목명
     */
    inter_kor_isnm: string;

    /**
     * 관심2 현재가
     */
    inter2_prpr: string;

    /**
     * 관심2 전일 대비
     */
    inter2_prdy_vrss: string;

    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 전일 대비율
     */
    prdy_ctrt: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 관심2 시가
     */
    inter2_oprc: string;

    /**
     * 관심2 고가
     */
    inter2_hgpr: string;

    /**
     * 관심2 저가
     */
    inter2_lwpr: string;

    /**
     * 관심2 하한가
     */
    inter2_llam: string;

    /**
     * 관심2 상한가
     */
    inter2_mxpr: string;

    /**
     * 관심2 매도호가
     */
    inter2_askp: string;

    /**
     * 관심2 매수호가
     */
    inter2_bidp: string;

    /**
     * 매도 잔량
     */
    seln_rsqn: string;

    /**
     * 매수2 잔량
     */
    shnu_rsqn: string;

    /**
     * 총 매도호가 잔량
     */
    total_askp_rsqn: string;

    /**
     * 총 매수호가 잔량
     */
    total_bidp_rsqn: string;

    /**
     * 누적 거래 대금
     */
    acml_tr_pbmn: string;

    /**
     * 관심2 전일 종가
     */
    inter2_prdy_clpr: string;

    /**
     * 시가 대비 최고가 비율
     */
    oprc_vrss_hgpr_rate: string;

    /**
     * 관심 예상 체결 대비
     */
    intr_antc_cntg_vrss: string;

    /**
     * 관심 예상 체결 대비 부호
     */
    intr_antc_cntg_vrss_sign: string;

    /**
     * 관심 예상 체결 전일 대비율
     */
    intr_antc_cntg_prdy_ctrt: string;

    /**
     * 관심 예상 거래량
     */
    intr_antc_vol: string;

    /**
     * 관심2 기준가
     */
    inter2_sdpr: string;
}

export interface DomesticStockQuotationsInquireDailyItemChartPriceParam {
    /**
     * 조건 시장 분류 코드 (J:KRX, NX:NXT, UN:통합)
     */
    FID_COND_MRKT_DIV_CODE: MarketDivCode;

    /**
     * 입력 종목코드 (ex 005930 삼성전자)
     */
    FID_INPUT_ISCD: string;

    /**
     * 입력 날짜 1 (조회 시작일자)
     */
    FID_INPUT_DATE_1: string;

    /**
     * 입력 날짜 2 (조회 종료일자, 최대 100개)
     */
    FID_INPUT_DATE_2: string;

    /**
     * 기간분류코드 (D:일봉 W:주봉, M:월봉, Y:년봉)
     */
    FID_PERIOD_DIV_CODE: string;

    /**
     * 수정주가 원주가 가격 여부 (0:수정주가 1:원주가)
     */
    FID_ORG_ADJ_PRC: string;
}

export interface DomesticStockQuotationsInquireDailyItemChartPriceOutput {
    /**
     * 전일 대비
     */
    prdy_vrss: string;

    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 전일 대비율
     */
    prdy_ctrt: string;

    /**
     * 주식 전일 종가
     */
    stck_prdy_clpr: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 누적 거래 대금
     */
    acml_tr_pbmn: string;

    /**
     * HTS 한글 종목명
     */
    hts_kor_isnm: string;

    /**
     * 주식 현재가
     */
    stck_prpr: string;

    /**
     * 주식 단축 종목코드
     */
    stck_shrn_iscd: string;

    /**
     * 전일 거래량
     */
    prdy_vol: string;

    /**
     * 주식 상한가
     */
    stck_mxpr: string;

    /**
     * 주식 하한가
     */
    stck_llam: string;

    /**
     * 주식 시가2
     */
    stck_oprc: string;

    /**
     * 주식 최고가
     */
    stck_hgpr: string;

    /**
     * 주식 최저가
     */
    stck_lwpr: string;

    /**
     * 주식 전일 시가
     */
    stck_prdy_oprc: string;

    /**
     * 주식 전일 최고가
     */
    stck_prdy_hgpr: string;

    /**
     * 주식 전일 최저가
     */
    stck_prdy_lwpr: string;

    /**
     * 매도호가
     */
    askp: string;

    /**
     * 매수호가
     */
    bidp: string;

    /**
     * 전일 대비 거래량
     */
    prdy_vrss_vol: string;

    /**
     * 거래량 회전율
     */
    vol_tnrt: string;

    /**
     * 주식 액면가
     */
    stck_fcam: string;

    /**
     * 상장 주수
     */
    lstn_stcn: string;

    /**
     * 자본금
     */
    cpfn: string;

    /**
     * HTS 시가총액
     */
    hts_avls: string;

    /**
     * PER
     */
    per: string;

    /**
     * EPS
     */
    eps: string;

    /**
     * PBR
     */
    pbr: string;

    /**
     * 전체 융자 잔고 비율
     */
    itewhol_loan_rmnd_ratem: string;
}
export interface DomesticStockQuotationsInquireDailyItemChartPriceOutput2 {
    /**
     * 주식 영업 일자
     */
    stck_bsop_date: string;

    /**
     * 주식 종가
     */
    stck_clpr: string;

    /**
     * 주식 시가2
     */
    stck_oprc: string;

    /**
     * 주식 최고가
     */
    stck_hgpr: string;

    /**
     * 주식 최저가
     */
    stck_lwpr: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 누적 거래 대금
     */
    acml_tr_pbmn: string;

    /**
     * 락 구분 코드
     * 01 : 권리락
     * 02 : 배당락
     * 03 : 분배락
     * 04 : 권배락
     * 05 : 중간(분기)배당락
     * 06 : 권리중간배당락
     * 07 : 권리분기배당락
     */
    flng_cls_code: string;

    /**
     * 분할 비율
     * 기준가/전일 종가
     */
    prtt_rate: string;

    /**
     * 변경 여부
     * 현재 영업일에 체결이 발생하지 않아 시가가 없을경우 Y 로 표시(차트에서 사용)
     */
    mod_yn: string;

    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 전일 대비
     */
    prdy_vrss: string;

    /**
     * 재평가사유코드
     * 00:해당없음
     * 01:회사분할
     * 02:자본감소
     * 03:장기간정지
     * 04:초과분배
     * 05:대규모배당
     * 06:회사분할합병
     * 07:ETN증권병합/분할
     * 08:신종증권기세조정
     * 99:기타
     */
    revl_issu_reas: string;
}

export interface DomesticStockQuotationsInquireInvestorParam {
    /**
     * 조건 시장 분류 코드 (J: KRX, NX: NXT, UN: 통합)
     */
    FID_COND_MRKT_DIV_CODE: MarketDivCode;

    /**
     * 입력 종목코드 (ex 005930 삼성전자)
     */
    FID_INPUT_ISCD: string;
}

export interface DomesticStockQuotationsInquireInvestorOutput {
    /**
     * 주식 영업 일자
     */
    stck_bsop_date: string;

    /**
     * 주식 종가
     */
    stck_clpr: string;

    /**
     * 전일 대비
     */
    prdy_vrss: string;

    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 개인 순매수 수량
     */
    prsn_ntby_qty: string;

    /**
     * 외국인 순매수 수량
     */
    frgn_ntby_qty: string;

    /**
     * 기관계 순매수 수량
     */
    orgn_ntby_qty: string;

    /**
     * 개인 순매수 거래 대금
     */
    prsn_ntby_tr_pbmn: string;

    /**
     * 외국인 순매수 거래 대금
     */
    frgn_ntby_tr_pbmn: string;

    /**
     * 기관계 순매수 거래 대금
     */
    orgn_ntby_tr_pbmn: string;

    /**
     * 개인 매수2 거래량
     */
    prsn_shnu_vol: string;

    /**
     * 외국인 매수2 거래량
     */
    frgn_shnu_vol: string;

    /**
     * 기관계 매수2 거래량
     */
    orgn_shnu_vol: string;

    /**
     * 개인 매수2 거래 대금
     */
    prsn_shnu_tr_pbmn: string;

    /**
     * 외국인 매수2 거래 대금
     */
    frgn_shnu_tr_pbmn: string;

    /**
     * 기관계 매수2 거래 대금
     */
    orgn_shnu_tr_pbmn: string;

    /**
     * 개인 매도 거래량
     */
    prsn_seln_vol: string;

    /**
     * 외국인 매도 거래량
     */
    frgn_seln_vol: string;

    /**
     * 기관계 매도 거래량
     */
    orgn_seln_vol: string;

    /**
     * 개인 매도 거래 대금
     */
    prsn_seln_tr_pbmn: string;

    /**
     * 외국인 매도 거래 대금
     */
    frgn_seln_tr_pbmn: string;

    /**
     * 기관계 매도 거래 대금
     */
    orgn_seln_tr_pbmn: string;
}

export interface DomesticStockInvestorTrendEstimateParam {
    /**
     * 종목코드
     * 6자리 종목번호 (예: 000660)
     */
    MKSC_SHRN_ISCD: string;
}

export class DomesticStockInvestorTrendEstimateOutput2 {
    /**
     * 입력구분
     * 1: 09시 30분, 2: 10시 00분, 3: 11시 20분, 4: 13시 20분, 5: 14시 30분
     */
    bsop_hour_gb: '1' | '2' | '3' | '4' | '5';

    /**
     * 외국인수량(가집계)
     */
    frgn_fake_ntby_qty: string;

    /**
     * 기관수량(가집계)
     */
    orgn_fake_ntby_qty: string;

    /**
     * 합산수량(가집계)
     */
    sum_fake_ntby_qty: string;
}

export interface DomesticStockInvestorTrendForeignParam {
    /**
     * 입력 종목코드
     * 종목번호 (6자리, 예: 005930)
     */
    FID_INPUT_ISCD: string;

    /**
     * 조건 화면 분류 코드
     * 외국계 전체(99999) 입력
     */
    FID_INPUT_ISCD_2: string;

    /**
     * 조건 시장 분류 코드
     * J (KRX만 지원)
     */
    FID_COND_MRKT_DIV_CODE: MarketDivCode.KRX;
}

export class DomesticStockInvestorTrendForeignOutput {
    /**
     * 영업시간
     */
    bsop_hour: string;

    /**
     * 주식 현재가
     */
    stck_prpr: string;

    /**
     * 전일 대비
     */
    prdy_vrss: string;

    /**
     * 전일 대비 부호
     * 1: 상한, 2: 상승, 3: 보합, 4: 하한, 5: 하락
     */
    prdy_vrss_sign: string;

    /**
     * 전일 대비율
     */
    prdy_ctrt: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 외국인 매도 거래량
     */
    frgn_seln_vol: string;

    /**
     * 외국인 매수2 거래량
     */
    frgn_shnu_vol: string;

    /**
     * 외국계 순매수 수량
     */
    glob_ntby_qty: string;

    /**
     * 외국인 순매수 수량 증감
     */
    frgn_ntby_qty_icdc: string;
}

/**
 * 국내업종 구분별전체시세 API Param
 */
export interface DomesticStockInquireIndexCategoryPriceParam {
    /**
     * FID 조건 시장 분류 코드
     * 시장구분코드 (업종 U)
     */
    FID_COND_MRKT_DIV_CODE: string;

    /**
     * FID 입력 종목코드
     * 코스피(0001), 코스닥(1001), 코스피200(2001) 등
     */
    FID_INPUT_ISCD: string;

    /**
     * FID 조건 화면 분류 코드
     * Unique key (20214)
     */
    FID_COND_SCR_DIV_CODE: string;

    /**
     * FID 시장 구분 코드
     * K:거래소, Q:코스닥, K2:코스피200
     */
    FID_MRKT_CLS_CODE: string;

    /**
     * FID 소속 구분 코드
     * 시장구분코드에 따라 0:전업종, 1:기타, 2:자본금/벤처, 3:상업/일반 등 입력
     */
    FID_BLNG_CLS_CODE: string;
}

/**
 * 국내업종 구분별전체시세 API Output1
 */
export class DomesticStockInquireIndexCategoryPriceOutput1 {
    /** 업종 지수 현재가 */
    bstp_nmix_prpr: string;

    /** 업종 지수 전일 대비 */
    bstp_nmix_prdy_vrss: string;

    /** 전일 대비 부호 */
    prdy_vrss_sign: string;

    /** 업종 지수 전일 대비율 */
    bstp_nmix_prdy_ctrt: string;

    /** 누적 거래량 */
    acml_vol: string;

    /** 누적 거래 대금 */
    acml_tr_pbmn: string;

    /** 업종 지수 시가2 */
    bstp_nmix_oprc: string;

    /** 업종 지수 최고가 */
    bstp_nmix_hgpr: string;

    /** 업종 지수 최저가 */
    bstp_nmix_lwpr: string;

    /** 전일 거래량 */
    prdy_vol: string;

    /** 상승 종목 수 */
    ascn_issu_cnt: string;

    /** 하락 종목 수 */
    down_issu_cnt: string;

    /** 보합 종목 수 */
    stnr_issu_cnt: string;

    /** 상한 종목 수 */
    uplm_issu_cnt: string;

    /** 하한 종목 수 */
    lslm_issu_cnt: string;

    /** 전일 거래 대금 */
    prdy_tr_pbmn: string;

    /** 연중업종지수최고가일자 */
    dryy_bstp_nmix_hgpr_date: string;

    /** 연중업종지수최고가 */
    dryy_bstp_nmix_hgpr: string;

    /** 연중업종지수최저가 */
    dryy_bstp_nmix_lwpr: string;

    /** 연중업종지수최저가일자 */
    dryy_bstp_nmix_lwpr_date: string;
}

/**
 * 국내업종 구분별전체시세 API Output2
 */
export class DomesticStockInquireIndexCategoryPriceOutput2 {
    /** 업종 구분 코드 */
    bstp_cls_code: string;

    /** HTS 한글 종목명 */
    hts_kor_isnm: string;

    /** 업종 지수 현재가 */
    bstp_nmix_prpr: string;

    /** 업종 지수 전일 대비 */
    bstp_nmix_prdy_vrss: string;

    /** 전일 대비 부호 */
    prdy_vrss_sign: string;

    /** 업종 지수 전일 대비율 */
    bstp_nmix_prdy_ctrt: string;

    /** 누적 거래량 */
    acml_vol: string;

    /** 누적 거래 대금 */
    acml_tr_pbmn: string;

    /** 누적 거래량 비중 */
    acml_vol_rlim: string;

    /** 누적 거래 대금 비중 */
    acml_tr_pbmn_rlim: string;
}

/**
 * 주식기본조회 API Param [1]
 */
export interface DomesticStockSearchStockInfoParam {
    /**
     * 상품유형코드
     * 300: 주식, ETF, ETN, ELW / 301: 선물옵션 / 302: 채권 / 306: ELS
     */
    PRDT_TYPE_CD: '300' | '301' | '302' | '306';

    /**
     * 상품번호
     * 종목번호 (6자리) / ETN의 경우, Q로 시작 (EX. Q500001)
     */
    PDNO: string;
}

export class DomesticStockSearchStockInfoOutput {
    /** 상품번호 */
    pdno: string;

    /** 상품유형코드 */
    prdt_type_cd: string;

    /** 시장ID코드 */
    mket_id_cd: string;

    /** 증권그룹ID코드 */
    scty_grp_id_cd: string;

    /** 거래소구분코드 */
    excg_dvsn_cd: string;

    /** 결산월일 */
    setl_mmdd: string;

    /** 상장주수 */
    lstg_stqt: string;

    /** 상장자본금액 */
    lstg_cptl_amt: string;

    /** 자본금 */
    cpta: string;

    /** 액면가 */
    papr: string;

    /** 발행가격 */
    issu_pric: string;

    /** 코스피200종목여부 */
    kospi200_item_yn: string;

    /** 유가증권시장상장일자 */
    scts_mket_lstg_dt: string;

    /** 유가증권시장상장폐지일자 */
    scts_mket_lstg_abol_dt: string;

    /** 코스닥시장상장일자 */
    kosdaq_mket_lstg_dt: string;

    /** 코스닥시장상장폐지일자 */
    kosdaq_mket_lstg_abol_dt: string;

    /** 프리보드시장상장일자 */
    frbd_mket_lstg_dt: string;

    /** 프리보드시장상장폐지일자 */
    frbd_mket_lstg_abol_dt: string;

    /** 리츠종류코드 */
    reits_kind_cd: string;

    /** ETF구분코드 */
    etf_dvsn_cd: string;

    /** 유전펀드여부 */
    oilf_fund_yn: string;

    /** 지수업종대분류코드 */
    idx_bztp_lcls_cd: string;

    /** 지수업종중분류코드 */
    idx_bztp_mcls_cd: string;

    /** 지수업종소분류코드 */
    idx_bztp_scls_cd: string;

    /** 주식종류코드 */
    stck_kind_cd: string;

    /** 뮤추얼펀드개시일자 */
    mfnd_opng_dt: string;

    /** 뮤추얼펀드종료일자 */
    mfnd_end_dt: string;

    /** 예탁등록취소일자 */
    dpsi_erlm_cncl_dt: string;

    /** ETFCU수량 */
    etf_cu_qty: string;

    /** 상품명 */
    prdt_name: string;

    /** 상품명120 */
    prdt_name120: string;

    /** 상품약어명 */
    prdt_abrv_name: string;

    /** 표준상품번호 */
    std_pdno: string;

    /** 상품영문명 */
    prdt_eng_name: string;

    /** 상품영문명120 */
    prdt_eng_name120: string;

    /** 상품영문약어명 */
    prdt_eng_abrv_name: string;

    /** 예탁지정등록여부 */
    dpsi_aptm_erlm_yn: string;

    /** ETF과세유형코드 */
    etf_txtn_type_cd: string;

    /** ETF유형코드 */
    etf_type_cd: string;

    /** 상장폐지일자 */
    lstg_abol_dt: string;

    /** 신주구주구분코드 */
    nwst_odst_dvsn_cd: string;

    /** 대용가격 */
    sbst_pric: string;

    /** 당사대용가격 */
    thco_sbst_pric: string;

    /** 당사대용가격변경일자 */
    thco_sbst_pric_chng_dt: string;

    /** 거래정지여부 */
    tr_stop_yn: string;

    /** 관리종목여부 */
    admn_item_yn: string;

    /** 당일종가 */
    thdt_clpr: string;

    /** 전일종가 */
    bfdy_clpr: string;

    /** 종가변경일자 */
    clpr_chng_dt: string;

    /** 표준산업분류코드 */
    std_idst_clsf_cd: string;

    /** 표준산업분류코드명 */
    std_idst_clsf_cd_name: string;

    /** 지수업종대분류코드명 */
    idx_bztp_lcls_cd_name: string;

    /** 지수업종중분류코드명 */
    idx_bztp_mcls_cd_name: string;

    /** 지수업종소분류코드명 */
    idx_bztp_scls_cd_name: string;

    /** OCR번호 */
    ocr_no: string;

    /** 크라우드펀딩종목여부 */
    crfd_item_yn: string;

    /** 전자증권여부 */
    elec_scty_yn: string;

    /** 발행기관코드 */
    issu_istt_cd: string;

    /** ETF추적수익율배수 */
    etf_chas_erng_rt_dbnb: string;

    /** ETFETN투자유의종목여부 */
    etf_etn_ivst_heed_item_yn: string;

    /** 대주이자율구분코드 */
    stln_int_rt_dvsn_cd: string;

    /** 외국인개인한도비율 */
    frnr_psnl_lmt_rt: string;

    /** 상장신청인발행기관코드 */
    lstg_rqsr_issu_istt_cd: string;

    /** 상장신청인종목코드 */
    lstg_rqsr_item_cd: string;

    /** 신탁기관발행기관코드 */
    trst_istt_issu_istt_cd: string;

    /** NXT 거래종목여부 */
    cptt_trad_tr_psbl_yn: string;

    /** NXT 거래정지여부 */
    nxt_tr_stop_yn: string;
}

export interface DomesticStockSearchInfoParam {
    /**
     * 상품번호
     * 주식(하이닉스) : 000660 (코드 : 300)
     * 선물(101S12) : KR4101SC0009 (코드 : 301)
     * 미국(AAPL) : AAPL (코드 : 512)
     */
    PDNO: string;

    /**
     * 상품유형코드
     * 300: 주식, 301: 선물옵션, 302: 채권
     * 512: 미국 나스닥, 513: 미국 뉴욕, 529: 미국 아멕스
     * 515: 일본, 501: 홍콩, 507: 베트남 하노이 등
     */
    PRDT_TYPE_CD:
        | '300'
        | '301'
        | '302'
        | '512'
        | '513'
        | '529'
        | '515'
        | '501'
        | '507';
}

export class DomesticStockSearchInfoOutput {
    /** 상품번호 */
    pdno: string;

    /** 상품유형코드 */
    prdt_type_cd: string;

    /** 상품명 */
    prdt_name: string;

    /** 상품명120 */
    prdt_name120: string;

    /** 상품약어명 */
    prdt_abrv_name: string;

    /** 상품영문명 */
    prdt_eng_name: string;

    /** 상품영문명120 */
    prdt_eng_name120: string;

    /** 상품영문약어명 */
    prdt_eng_abrv_name: string;

    /** 표준상품번호 */
    std_pdno: string;

    /** 단축상품번호 */
    shtn_pdno: string;

    /** 상품판매상태코드 */
    prdt_sale_stat_cd: string;

    /** 상품위험등급코드 */
    prdt_risk_grad_cd: string;

    /** 상품분류코드 */
    prdt_clsf_cd: string;

    /** 상품분류명 */
    prdt_clsf_name: string;

    /** 판매시작일자 */
    sale_strt_dt: string;

    /** 판매종료일자 */
    sale_end_dt: string;

    /** 랩어카운트자산유형코드 */
    wrap_asst_type_cd: string;

    /** 투자상품유형코드 */
    ivst_prdt_type_cd: string;

    /** 투자상품유형코드명 */
    ivst_prdt_type_cd_name: string;

    /** 최초등록일자 */
    frst_erlm_dt: string;
}

/**
 * 국내주식 업종기간별시세 Param
 */
export interface DomesticStockInquireDailyIndexChartPriceParam {
    /**
     * 조건 시장 분류 코드
     * 업종 : U
     */
    FID_COND_MRKT_DIV_CODE: 'U';

    /**
     * 업종 상세코드
     * 0001 : 종합, 0002 : 대형주 등 (포탈 FAQ 참조)
     */
    FID_INPUT_ISCD: string;

    /**
     * 조회 시작일자 (YYYYMMDD)
     */
    FID_INPUT_DATE_1: string;

    /**
     * 조회 종료일자 (YYYYMMDD)
     */
    FID_INPUT_DATE_2: string;

    /**
     * 기간분류코드
     * D:일봉, W:주봉, M:월봉, Y:년봉
     */
    FID_PERIOD_DIV_CODE: PeriodType;
}

/**
 * 국내주식 업종기간별시세 Output1 (기본 정보)
 */
export class DomesticStockInquireDailyIndexChartPriceOutput1 {
    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 업종 지수 전일 대비율
     */
    bstp_nmix_prdy_ctrt: string;

    /**
     * 전일 지수
     */
    prdy_nmix: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 누적 거래 대금
     */
    acml_tr_pbmn: string;

    /**
     * HTS 한글 종목명
     */
    hts_kor_isnm: string;

    /**
     * 업종 지수 현재가
     */
    bstp_nmix_prpr: string;

    /**
     * 업종 구분 코드
     */
    bstp_cls_code: string;

    /**
     * 전일 거래량
     */
    prdy_vol: string;

    /**
     * 업종 지수 시가2
     */
    bstp_nmix_oprc: string;

    /**
     * 업종 지수 최고가
     */
    bstp_nmix_hgpr: string;

    /**
     * 업종 지수 최저가
     */
    bstp_nmix_lwpr: string;

    /**
     * 선물 전일 시가
     */
    futs_prdy_oprc: string;

    /**
     * 선물 전일 최고가
     */
    futs_prdy_hgpr: string;

    /**
     * 선물 전일 최저가
     */
    futs_prdy_lwpr: string;
}

/**
 * 국내주식 업종기간별시세 Output2 (일자별 목록)
 */
export class DomesticStockInquireDailyIndexChartPriceOutput2 {
    /**
     * 주식 영업 일자
     */
    stck_bsop_date: string;

    /**
     * 업종 지수 현재가
     */
    bstp_nmix_prpr: string;

    /**
     * 업종 지수 시가2
     */
    bstp_nmix_oprc: string;

    /**
     * 업종 지수 최고가
     */
    bstp_nmix_hgpr: string;

    /**
     * 업종 지수 최저가
     */
    bstp_nmix_lwpr: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 누적 거래 대금
     */
    acml_tr_pbmn: string;

    /**
     * 변경 여부
     */
    mod_yn: string;
}

export interface KoreaInvestmentDomesticInquireIndexDailyPriceParam {
    /**
     * FID 기간 분류 코드
     * D:일별, W:주별, M:월별
     */
    FID_PERIOD_DIV_CODE: string;

    /**
     * FID 조건 시장 분류 코드
     * 시장구분코드 (업종 U)
     */
    FID_COND_MRKT_DIV_CODE: string;

    /**
     * FID 입력 종목코드
     * 코스피(0001), 코스닥(1001), 코스피200(2001)
     */
    FID_INPUT_ISCD: string;

    /**
     * FID 입력 날짜1
     * 입력 날짜 (YYYYMMDD)
     */
    FID_INPUT_DATE_1: string;
}

export class KoreaInvestmentDomesticInquireIndexDailyPriceOutput {
    bstp_nmix_prpr: string;

    /**
     * 업종 지수 전일 대비
     */
    bstp_nmix_prdy_vrss: string;

    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 업종 지수 전일 대비율
     */
    bstp_nmix_prdy_ctrt: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 누적 거래 대금
     */
    acml_tr_pbmn: string;

    /**
     * 상승 종목 수
     */
    ascn_issu_cnt: string;

    /**
     * 하락 종목 수
     */
    down_issu_cnt: string;

    /**
     * 보합 종목 수
     */
    stnr_issu_cnt: string;

    /**
     * 상한 종목 수
     */
    uplm_issu_cnt: string;

    /**
     * 하한 종목 수
     */
    lslm_issu_cnt: string;

    /**
     * 연중업종지수최고가
     */
    dryy_bstp_nmix_hgpr: string;

    /**
     * 연중업종지수최저가
     */
    dryy_bstp_nmix_lwpr: string;
}

export class KoreaInvestmentDomesticInquireIndexDailyPriceOutput2 {
    /**
     * 주식 영업 일자
     */
    stck_bsop_date: string;

    /**
     * 업종 지수 현재가
     */
    bstp_nmix_prpr: string;

    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 업종 지수 전일 대비
     */
    bstp_nmix_prdy_vrss: string;

    /**
     * 업종 지수 전일 대비율
     */
    bstp_nmix_prdy_ctrt: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 누적 거래 대금
     */
    acml_tr_pbmn: string;

    /**
     * 투자 신 심리도
     */
    invt_new_psdg: string;

    /**
     * 20일 이격도
     */
    d20_dsrt: string;
}

export interface OverseasQuotationInquireDailyChartPriceParam {
    /**
     * FID 조건 시장 분류 코드
     * N: 해외지수, X 환율, I: 국채, S:금선물
     */
    FID_COND_MRKT_DIV_CODE: string;

    /**
     * FID 입력 종목코드
     * 종목코드
     * ※ 해외주식 마스터 코드 참조
     * (포럼 > FAQ > 종목정보 다운로드(해외) > 해외지수)
     *
     * ※ 해당 API로 미국주식 조회 시, 다우30, 나스닥100, S&P500 종목만 조회 가능합니다. 더 많은 미국주식 종목 시세를 이용할 시에는, 해외주식기간별시세 API 사용 부탁드립니다.
     */
    FID_INPUT_ISCD: string;

    /**
     * FID 입력 날짜1
     * 시작일자(YYYYMMDD)
     */
    FID_INPUT_DATE_1: string;

    /**
     * FID 입력 날짜2
     * 종료일자(YYYYMMDD)
     */
    FID_INPUT_DATE_2: string;

    /**
     * FID 기간 분류 코드
     * D:일, W:주, M:월, Y:년
     */
    FID_PERIOD_DIV_CODE: string;
}

export interface OverseasQuotationInquireDailyChartPriceOutput {
    /**
     *  전일 대비
     */
    ovrs_nmix_prdy_vrss: string;

    /**
     * 전일 대비 부호
     */
    prdy_vrss_sign: string;

    /**
     * 전일 대비율
     */
    prdy_ctrt: string;

    /**
     * 전일 종가
     */
    ovrs_nmix_prdy_clpr: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * HTS 한글 종목명
     */
    hts_kor_isnm: string;

    /**
     * 현재가
     */
    ovrs_nmix_prpr: string;

    /**
     * 단축 종목코드
     */
    stck_shrn_iscd: string;

    /**
     * 전일 거래량
     */
    prdy_vol: string;

    /**
     * 시가
     */
    ovrs_prod_oprc: string;

    /**
     * 최고가
     */
    ovrs_prod_hgpr: string;

    /**
     * 최저가
     */
    ovrs_prod_lwpr: string;
}

export interface OverseasQuotationInquireDailyChartPriceOutput2 {
    /**
     * 영업 일자
     */
    stck_bsop_date: string;

    /**
     * 현재가
     */
    ovrs_nmix_prpr: string;

    /**
     * 시가
     */
    ovrs_nmix_oprc: string;

    /**
     * 최고가
     */
    ovrs_nmix_hgpr: string;

    /**
     * 최저가
     */
    ovrs_nmix_lwpr: string;

    /**
     * 누적 거래량
     */
    acml_vol: string;

    /**
     * 변경 여부
     */
    mod_yn: string;
}

export interface DomesticHolidayInquiryParam {
    /**
     * 기준일자
     * (YYYYMMDD)
     */
    BASS_DT: string;

    /**
     * 연속조회키
     * (공백으로 입력)
     */
    CTX_AREA_NK: string;

    /**
     * 연속조회검색조건
     * (공백으로 입력)
     */
    CTX_AREA_FK: string;
}

export class DomesticHolidayInquiryOutput {
    /**
     * 기준일자
     * (YYYYMMDD)
     */
    bass_dt: string;

    /**
     * 요일구분코드
     * (01:일요일, 02:월요일, 03:화요일, 04:수요일, 05:목요일, 06:금요일, 07:토요일)
     */
    wday_dvsn_cd: string;

    /**
     * 영업일여부
     * (Y/N, 금융기관이 업무를 하는 날)
     */
    bzdy_yn: string;

    /**
     * 거래일여부
     * (Y/N, 증권 업무가 가능한 날)
     */
    tr_day_yn: string;

    /**
     * 개장일여부
     * (Y/N, 주식시장이 개장되는 날 - 주문 가능 여부 확인용)
     */
    opnd_yn: string;

    /**
     * 결제일여부
     * (Y/N, 주식 거래에서 실제로 주식을 인수하고 돈을 지불하는 날)
     */
    sttl_day_yn: string;
}
