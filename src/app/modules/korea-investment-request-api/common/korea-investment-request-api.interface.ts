import { ApiProperty } from '@nestjs/swagger';
import { MarketDivCode, ProductType } from '@modules/korea-investment/common';

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
