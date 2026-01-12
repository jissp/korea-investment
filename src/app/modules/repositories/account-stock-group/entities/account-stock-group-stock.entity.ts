import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('account_stock_group_stocks')
export class AccountStockGroupStock {
    /**
     * 고유 식별 번호
     */
    @PrimaryGeneratedColumn()
    @ApiProperty({
        description: '고유 식별 번호',
    })
    id!: number;

    /**
     * 그룹 코드
     */
    @Column({ type: 'varchar', comment: '그룹 코드', length: 32 })
    @ApiProperty({
        description: '그룹 코드',
    })
    groupCode!: string;

    /**
     * 종목 코드
     */
    @Column({ type: 'varchar', comment: '종목 코드', length: 32 })
    @ApiProperty({
        description: '종목 코드',
    })
    stockCode!: string;

    /**
     * 종목명
     */
    @Column({ type: 'varchar', comment: '종목명', length: 32 })
    @ApiProperty({
        description: '종목명',
    })
    stockName!: string;

    /**
     * 현재가
     */
    @Column({ type: 'decimal' })
    @ApiProperty({
        description: '현재가',
    })
    price!: number;

    /**
     * 전일 대비
     */
    @Column({ type: 'decimal', precision: 12, scale: 4 })
    @ApiProperty({
        description: '전일 대비',
    })
    changePrice!: number;

    /**
     * 등락률
     */
    @Column({ type: 'decimal', precision: 8, scale: 4 })
    @ApiProperty({
        description: '등락률',
    })
    changePriceRate!: number;

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
