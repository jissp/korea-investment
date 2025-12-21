import { ApiProperty } from '@nestjs/swagger';

export enum KoreaInvestmentAccountCrawlerType {
    RequestAccount = 'RequestAccount',
    RequestAccountStocks = 'RequestAccountStocks',
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

export class KoreaInvestmentAccountResponse {
    @ApiProperty({
        type: KoreaInvestmentAccountOutput,
        isArray: true,
    })
    output1: KoreaInvestmentAccountOutput[];

    @ApiProperty({
        type: KoreaInvestmentAccountOutput2,
    })
    output2: KoreaInvestmentAccountOutput2;
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
    dnca_tot_amt: string;

    /**
     * 익일정산금액 D+1 예수금
     */
    nxdy_excc_amt: string;

    /**
     * 가수도정산금액 D+2 예수금
     */
    prvs_rcdl_excc_amt: string;

    /**
     * CMA평가금액
     */
    cma_evlu_amt: string;

    /**
     * 전일매수금액
     */
    bfdy_buy_amt: string;

    /**
     * 금일매수금액
     */
    thdt_buy_amt: string;

    /**
     * 익일자동상환금액
     */
    nxdy_auto_rdpt_amt: string;

    /**
     * 전일매도금액
     */
    bfdy_sll_amt: string;

    /**
     * 금일매도금액
     */
    thdt_sll_amt: string;

    /**
     * D+2자동상환금액
     */
    d2_auto_rdpt_amt: string;

    /**
     * 전일제비용금액
     */
    bfdy_tlex_amt: string;

    /**
     * 금일제비용금액
     */
    thdt_tlex_amt: string;

    /**
     * 총대출금액
     */
    tot_loan_amt: string;

    /**
     * 유가평가금액
     */
    scts_evlu_amt: string;

    /**
     * 총평가금액 유가증권 평가금액 합계금액 + D+2 예수금
     */
    tot_evlu_amt: string;

    /**
     * 순자산금액
     */
    nass_amt: string;

    /**
     * 융자금자동상환여부 보유현금에 대한 융자금만 차감여부
     * 신용융자 매수체결 시점에서는 융자비율을 매매대금 100%로 계산 하였다가 수도결제일에 보증금에 해당하는 금액을 고객의 현금으로 충당하여 융자금을 감소시키는 업무
     */
    fncg_gld_auto_rdpt_yn: string;

    /**
     * 매입금액합계금액
     */
    pchs_amt_smtl_amt: string;

    /**
     * 평가금액합계금액 유가증권 평가금액 합계금액
     */
    evlu_amt_smtl_amt: string;

    /**
     * 평가손익합계금액
     */
    evlu_pfls_smtl_amt: string;

    /**
     * 총대주매각대금
     */
    tot_stln_slng_chgs: string;

    /**
     * 전일총자산평가금액
     */
    bfdy_tot_asst_evlu_amt: string;

    /**
     * 자산증감액
     */
    asst_icdc_amt: string;

    /**
     * 자산증감수익율 데이터 미제공
     */
    asst_icdc_erng_rt: string;
}

export class KoreaInvestmentAccountStockResponse {
    @ApiProperty({
        type: KoreaInvestmentAccountStockOutput,
        isArray: true,
    })
    output1: KoreaInvestmentAccountStockOutput[];

    @ApiProperty({
        type: KoreaInvestmentAccountStockOutput2,
        isArray: true,
    })
    output2: KoreaInvestmentAccountStockOutput2[];
}
