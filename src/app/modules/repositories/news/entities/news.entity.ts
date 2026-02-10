import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NewsCategory } from '../news.types';

@Entity('news')
export class News {
    /**
     * 고유 식별 번호
     */
    @PrimaryGeneratedColumn()
    @ApiProperty({
        description: '고유 식별 번호',
    })
    id!: number;

    /**
     * 뉴스 ID
     */
    @Column({ type: 'varchar', length: 255, unique: true })
    @ApiProperty({
        description: '뉴스 ID',
    })
    articleId!: string;

    /**
     * 뉴스 출처
     */
    @Column({ type: 'varchar', length: 255, nullable: true })
    @ApiProperty({
        description: '뉴스 출처',
    })
    category!: NewsCategory;

    /**
     * 뉴스 제목
     */
    @Column({ type: 'varchar', length: 500 })
    @ApiProperty({
        description: '뉴스 제목',
    })
    title!: string;

    /**
     * 뉴스 내용
     */
    @Column({ type: 'text', nullable: true })
    @ApiPropertyOptional({
        description: '뉴스 내용',
        type: String,
    })
    description?: string | null;

    /**
     * 뉴스 링크
     */
    @Column({ type: 'varchar', length: 500, nullable: true })
    @ApiPropertyOptional({
        description: '뉴스 링크',
        type: String,
        nullable: true,
    })
    link?: string | null;

    @Column({ type: 'datetime' })
    @ApiProperty({ type: Date, description: '뉴스기사 작성일' })
    publishedAt!: Date;

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
