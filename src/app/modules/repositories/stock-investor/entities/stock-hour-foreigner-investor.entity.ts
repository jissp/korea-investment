import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('stock_hour_foreigner_investors')
export class StockHourForeignerInvestor {
    /**
     * 고유 식별 번호
     */
    @PrimaryGeneratedColumn()
    @ApiProperty({
        description: '고유 식별 번호',
    })
    id!: number;

    /**
     * 종목코드
     */
    @Column({ type: 'varchar', length: 32, comment: '종목코드' })
    @ApiProperty({
        description: '종목코드',
    })
    stockCode!: string;

    /**
     * 날짜
     */
    @Column({ type: 'varchar', length: 12, comment: '날짜' })
    @ApiProperty({
        description: '날짜',
    })
    date!: string;

    /**
     * 시간 코드
     */
    @Column({ enum: ['1', '2', '3', '4', '5'], comment: '시간 코드' })
    @ApiProperty({
        description: '시간 코드',
    })
    timeCode!: '1' | '2' | '3' | '4' | '5';

    /**
     * 외국인 순매수량
     */
    @Column({ type: 'integer', comment: '외국인 순매수량' })
    @ApiProperty({
        description: '외국인 순매수량',
    })
    foreigner!: number;

    /**
     * 외국 기관 순매수
     */
    @Column({ type: 'integer', comment: '외국 기관 순매수량' })
    @ApiProperty({
        description: '외국 기관 순매수량',
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
