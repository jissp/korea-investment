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
    @Column({ type: 'integer' })
    @ApiProperty({
        description: '종가',
    })
    price!: number;

    /**
     * 개인 매수
     */
    @Column({ type: 'integer' })
    @ApiProperty({
        description: '개인 매수량',
    })
    person!: number;

    /**
     * 외국인 매수량
     */
    @Column({ type: 'integer' })
    @ApiProperty({
        description: '외국인 매수량',
    })
    foreigner!: number;

    /**
     * 기관 매수량
     */
    @Column({ type: 'integer' })
    @ApiProperty({
        description: '기관 매수량',
    })
    organization!: number;

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
