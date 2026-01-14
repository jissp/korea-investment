import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExchangeType, MarketType, YN } from '@app/common/types';

@Entity('stocks')
export class Stock {
    /**
     * 고유 식별 번호
     */
    @PrimaryGeneratedColumn()
    @ApiProperty({
        description: '고유 식별 번호',
    })
    id!: number;

    /**
     * 긴 종목 코드
     */
    @Column({ type: 'varchar', length: 32 })
    @ApiProperty({
        description: '긴 종목 코드',
    })
    code!: string;

    /**
     * 짧은 종목 코드
     */
    @Column({ type: 'varchar', length: 32 })
    @ApiProperty({
        description: '짧은 종목 코드',
    })
    shortCode!: string;

    /**
     * 종목명
     */
    @Column({ type: 'varchar', length: 100 })
    @ApiProperty({
        description: '종목명',
    })
    name!: string;

    /**
     * 국내/해외 종목 유형
     */
    @Column({ type: 'enum', enum: MarketType })
    @ApiProperty({
        description: '국내/해외 종목 유형',
    })
    marketType!: MarketType;

    /**
     * 거래소 구분
     */
    @Column({ type: 'enum', enum: ExchangeType })
    @ApiProperty({
        description: '거래소 구분',
    })
    exchangeType!: ExchangeType;

    /**
     * nxt 시장 거래 여부
     */
    @Column({ type: 'enum', enum: YN })
    @ApiProperty({
        description: 'nxt 시장 거래 여부',
    })
    isNextTrade!: YN;

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
