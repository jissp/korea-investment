import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { YN } from '@app/common';

@Entity('korea_investment_holidays')
export class KoreaInvestmentHoliday {
    /**
     * 고유 식별 번호
     */
    @PrimaryGeneratedColumn()
    @ApiProperty({
        description: '고유 식별 번호',
    })
    id!: number;

    /**
     * 날짜
     */
    @Column({ type: 'varchar', length: 32, comment: '날짜' })
    @ApiProperty({
        description: '날짜',
    })
    date!: string;

    /**
     * 요일구분코드
     */
    @Column({ type: 'varchar', length: 32, comment: '요일구분코드' })
    @ApiProperty({
        description: '요일구분코드',
    })
    dayCode!: string;

    /**
     * 개장일여부
     */
    @Column({ enum: YN, comment: '개장일여부' })
    @ApiProperty({
        description: '개장일여부',
    })
    isOpen!: YN;

    /**
     * 거래일여부
     */
    @Column({ enum: YN, comment: '거래일여부' })
    @ApiProperty({
        description: '거래일여부',
    })
    isTrade!: YN;

    /**
     * 영업일여부
     */
    @Column({ enum: YN, comment: '영업일여부' })
    @ApiProperty({
        description: '영업일여부',
    })
    isBusiness!: YN;

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
