import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MarketType } from '@app/common/types';

@Entity('stock_daily_investors')
export class StockDailyInvestor {
    /**
     * 고유 식별 번호
     */
    @PrimaryGeneratedColumn()
    @ApiProperty({
        description: '고유 식별 번호',
    })
    id!: number;

    /**
     * 종목 코드
     */
    @Column({ type: 'enum', enum: MarketType })
    @ApiProperty({
        description: '국내/해외 종목 유형',
    })
    marketType!: MarketType;

    /**
     * 날짜
     */
    @Column({ type: 'varchar', length: 12 })
    @ApiProperty({
        description: '날짜',
    })
    date!: string;

    /**
     * 종목 코드
     */
    @Column({ type: 'varchar', length: 32 })
    @ApiProperty({
        description: '종목 코드',
    })
    stockCode!: string;

    /**
     * 종목명
     */
    @Column({ type: 'varchar', length: 100 })
    @ApiProperty({
        description: '종목명',
    })
    stockName!: string;

    /**
     * 종가
     */
    @Column({ type: 'integer', default: 0 })
    @ApiProperty({
        description: '종가',
    })
    price!: number;

    /**
     * 고가
     */
    @Column({ type: 'integer', default: 0 })
    @ApiProperty({
        description: '고가',
    })
    highPrice!: number;

    /**
     * 저가
     */
    @Column({ type: 'integer', default: 0 })
    @ApiProperty({
        description: '저가',
    })
    lowPrice!: number;

    /**
     * 누적 거래량
     */
    @Column({ type: 'integer', default: 0 })
    @ApiProperty({
        description: '누적 거래량',
    })
    tradeVolume: number;

    /**
     * 개인 순매수 수량
     */
    @Column({ type: 'integer', default: 0 })
    @ApiProperty({
        description: '개인 순매수 수량',
    })
    person: number;

    /**
     * 외국인 순매수 수량
     */
    @Column({ type: 'integer', default: 0 })
    @ApiProperty({
        description: '외국인 순매수 수량',
    })
    foreigner: number;

    /**
     * 기관계 순매수 수량
     */
    @Column({ type: 'integer', default: 0 })
    @ApiProperty({
        description: '기관계 순매수 수량',
    })
    organization: number;

    /**
     * 증권 순매수 수량
     */
    @Column({ type: 'integer', default: 0 })
    @ApiProperty({
        description: '증권 순매수 수량',
    })
    financialInvestment: number;

    /**
     * 투자신탁 순매수 수량
     */
    @Column({ type: 'integer', default: 0 })
    @ApiProperty({
        description: '투자신탁 순매수 수량',
    })
    investmentTrust: number;

    /**
     * 사모 펀드 순매수 거래량
     */
    @Column({ type: 'integer', default: 0 })
    @ApiProperty({
        description: '사모 펀드 순매수 거래량',
    })
    privateEquity: number;

    /**
     * 은행 순매수 수량
     */
    @Column({ type: 'integer', default: 0 })
    @ApiProperty({
        description: '은행 순매수 수량',
    })
    bank: number;

    /**
     * 보험 순매수 수량
     */
    @Column({ type: 'integer', default: 0 })
    @ApiProperty({
        description: '보험 순매수 수량',
    })
    insurance: number;

    /**
     * 종금 순매수 수량
     */
    @Column({ type: 'integer', default: 0 })
    @ApiProperty({
        description: '종금 순매수 수량',
    })
    merchantBank: number;

    /**
     * 기금 순매수 수량
     */
    @Column({ type: 'integer', default: 0 })
    @ApiProperty({
        description: '기금 순매수 수량',
    })
    fund: number;

    /**
     * 기타 순매수 수량
     */
    @Column({ type: 'integer', default: 0 })
    @ApiProperty({
        description: '기타 순매수 수량',
    })
    etc: number;

    @CreateDateColumn({
        type: 'datetime',
        default: 'CURRENT_TIMESTAMP()',
    })
    @ApiProperty({ type: Date, description: '생성일' })
    createdAt!: Date;

    @UpdateDateColumn({
        type: 'datetime',
        onUpdate: 'CURRENT_TIMESTAMP()',
        nullable: true,
    })
    @ApiPropertyOptional({ type: Date, description: '수정일' })
    updatedAt?: Date | null;
}
