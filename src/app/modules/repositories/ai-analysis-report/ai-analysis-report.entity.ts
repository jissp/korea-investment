import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ReportType } from '@app/modules/repositories/ai-analysis-report/ai-analysis-report.types';

@Entity('ai_analysis_reports')
export class AiAnalysisReport {
    /**
     * 고유 식별 번호
     */
    @PrimaryGeneratedColumn()
    @ApiProperty({
        description: '고유 식별 번호',
    })
    id!: number;

    /**
     * 리포트 유형
     */
    @Column({ enum: ReportType })
    @ApiProperty({
        enum: ReportType,
        description: '리포트 유형',
    })
    reportType!: ReportType;

    /**
     * 분석 대상
     */
    @Column({ type: 'varchar', length: 255 })
    @ApiProperty({
        type: String,
        description: '분석 대상',
    })
    reportTarget!: string;

    /**
     * 리포트 제
     */
    @Column({ type: 'varchar', length: 255, unique: true })
    @ApiProperty({
        description: '리포트 제목',
    })
    title!: string;

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
}
