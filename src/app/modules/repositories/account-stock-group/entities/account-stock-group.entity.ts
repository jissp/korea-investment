import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('account_stock_groups')
export class AccountStockGroup {
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
    code!: string;

    /**
     * 그룹명
     */
    @Column({ type: 'varchar', comment: '그룹명', length: 32 })
    @ApiProperty({
        description: '그룹명',
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
