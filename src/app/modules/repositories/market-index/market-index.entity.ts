import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { MarketType } from '@app/common/types';

@Entity('market_indices')
export class MarketIndex {
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
        type: String,
        description: '날짜',
    })
    date!: string;

    /**
     * 지수 코드
     */
    @Column({ type: 'varchar', length: 32 })
    @ApiProperty({
        description: '지수 코드',
    })
    code!: string;

    /**
     * 지수명
     */
    @Column({ type: 'varchar', length: 100 })
    @ApiProperty({
        description: '지수명',
    })
    name!: string;

    /**
     * 현재가
     */
    @Column({ type: 'decimal', precision: 20, scale: 2 })
    @ApiProperty({
        description: '현재가',
    })
    value!: number;

    /**
     * 전일 대비
     */
    @Column({ type: 'decimal', precision: 20, scale: 2 })
    @ApiProperty({
        description: '전일 대비',
    })
    changeValue!: number;

    /**
     * 등락률
     */
    @Column({ type: 'decimal', precision: 10, scale: 4 })
    @ApiProperty({
        description: '등락률',
    })
    changeValueRate!: number;

    @CreateDateColumn({
        type: 'datetime',
        default: 'CURRENT_TIMESTAMP()',
    })
    @ApiProperty({ type: Date, description: '생성일' })
    createdAt!: Date;
}
