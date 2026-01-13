import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('domestic_indices')
export class DomesticIndex {
    /**
     * 고유 식별 번호
     */
    @PrimaryGeneratedColumn({
        unsigned: true,
    })
    @ApiProperty({
        description: '고유 식별 번호',
    })
    id!: number;

    /**
     * 업종 코드
     */
    @Column({ type: 'varchar', length: 32, comment: '업종 코드' })
    @ApiProperty({
        description: '업종 코드',
    })
    code!: string;

    /**
     * 업종명
     */
    @Column({ type: 'varchar', length: 255, comment: '업종명' })
    @ApiProperty({
        description: '업종명',
    })
    name!: string;

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
