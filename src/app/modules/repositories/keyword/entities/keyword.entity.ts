import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Nullable } from '@common/types';
import { KeywordType } from '../keyword.types';

@Entity('keywords')
export class Keyword {
    /**
     * 고유 식별 번호
     */
    @PrimaryGeneratedColumn()
    @ApiProperty({
        description: '고유 식별 번호',
    })
    id!: number;

    /**
     * 키워드 유형
     */
    @Column({ enum: KeywordType })
    @ApiProperty({
        description: '키워드 유형',
    })
    type!: KeywordType;

    /**
     * 키워드명
     */
    @Column({ type: 'varchar', length: 32 })
    @ApiProperty({
        description: '키워드명',
    })
    name!: string;

    /**
     * 키워드 그룹 ID
     */
    @Column({ type: 'integer', unsigned: true, nullable: true })
    @ApiProperty({
        type: Number,
        description: '키워드 그룹 ID',
        nullable: true,
    })
    keywordGroupId?: Nullable<number>;

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
