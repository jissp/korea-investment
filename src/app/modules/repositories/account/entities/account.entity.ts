import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('accounts')
export class Account {
    /**
     * 고유 식별 번호
     */
    @PrimaryGeneratedColumn()
    @ApiProperty({
        description: '고유 식별 번호',
    })
    id!: number;

    /**
     * 계좌 번호
     */
    @Column({ type: 'varchar', length: 100 })
    @ApiProperty({
        description: '계좌 번호',
    })
    accountId!: string;

    /**
     * 매입금액합계 유가매입금액
     */
    @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 })
    @ApiProperty({
        description: '매입금액합계 유가매입금액',
    })
    pchsAmtSmtl!: number;

    /**
     * 평가손익금액합계 평가손익금액
     */
    @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 })
    @ApiProperty({
        description: '평가손익금액합계 평가손익금액',
    })
    evluPflsAmtSmtl!: number;

    /**
     * 총자산금액 총 자산금액
     */
    @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 })
    @ApiProperty({
        description: '총자산금액 총 자산금액',
    })
    totAsstAmt!: number;

    /**
     * 총예수금액
     */
    @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 })
    @ApiProperty({
        description: '총예수금액',
    })
    totDnclAmt!: number;

    /**
     * 순자산총금액
     */
    @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 })
    @ApiProperty({
        description: '순자산총금액',
    })
    nassTotAmt!: number;

    /**
     * 외화평가총액
     */
    @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 })
    @ApiProperty({
        description: '외화평가총액',
    })
    frcrEvluTota!: number;

    /**
     * 해외주식평가금액1
     */
    @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 })
    @ApiProperty({
        description: '해외주식평가금액1',
    })
    ovrsStckEvluAmt1!: number;

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
