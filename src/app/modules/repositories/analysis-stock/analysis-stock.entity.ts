import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('analysis_stocks')
export class AnalysisStockEntity {
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
    @Column({ type: 'varchar', length: 32, unique: true })
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
     * AI 분석 내용
     */
    @Column({ type: 'text' })
    @ApiProperty({
        description: 'AI 분석 내용',
    })
    content!: string;

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
