import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('trading_volume_ranks')
export class TradingVolumeRank {
    /**
     * 고유 식별 번호
     */
    @PrimaryGeneratedColumn()
    @ApiProperty({
        description: '고유 식별 번호',
    })
    id!: number;

    /**
     * 주식 코드
     */
    @Column({ type: 'varchar', length: 32 })
    @ApiProperty({
        description: '주식 코드',
    })
    stockCode!: string;

    /**
     * 주식 이름
     */
    @Column({ type: 'varchar', length: 100 })
    @ApiProperty({
        description: '주식 이름',
    })
    stockName!: string;

    /**
     * 현재가
     */
    @Column({
        type: 'decimal',
        precision: 12,
        scale: 4,
        unsigned: true,
        default: 0,
    })
    @ApiProperty({
        description: '현재가',
    })
    price!: number;

    /**
     * 전일 대비
     */
    @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 })
    @ApiProperty({
        description: '전일 대비',
    })
    changePrice!: number;

    /**
     * 등락률
     */
    @Column({ type: 'decimal', precision: 8, scale: 4, default: 0 })
    @ApiProperty({
        description: '등락률',
    })
    changePriceRate!: number;

    /**
     * 거래량
     */
    @Column({ type: 'bigint', unsigned: true, default: 0 })
    @ApiProperty({
        description: '거래량',
    })
    tradingVolume!: number;

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
