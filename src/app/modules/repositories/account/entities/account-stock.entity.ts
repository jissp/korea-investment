import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('account_stocks')
export class AccountStock {
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
    @Column({ type: 'varchar', length: 32 })
    @ApiProperty({
        description: '계좌 번호',
    })
    accountId!: string;

    /**
     * 종목 코드
     */
    @Column({ type: 'varchar', length: 32 })
    @ApiProperty({
        description: '종목 코드',
    })
    stockCode!: string;

    /**
     * 종목명
     */
    @Column({ type: 'varchar', length: 32 })
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
     * 보유 수
     */
    @Column({ type: 'integer' })
    @ApiProperty({
        description: '보유 수량',
    })
    quantity!: number;

    /**
     * 매입금액
     */
    @Column({ type: 'decimal' })
    @ApiProperty({
        description: '매입금액',
    })
    pchsAmt!: number;

    /**
     * 매입평균가격
     * 매입금액 / 보유수량
     */
    @Column({ type: 'decimal' })
    @ApiProperty({
        description: '매입평균가격',
    })
    pchsAvgPric!: number;

    /**
     * 평가 금액
     */
    @Column({ type: 'decimal' })
    @ApiProperty({
        description: '평가 금액',
    })
    evluAmt!: number;

    /**
     * 상장폐지 여부
     */
    @Column({ enum: ['Y', 'N'] })
    @ApiProperty({
        enum: ['Y', 'N'],
        description: '상장폐지 여부',
    })
    isClosed!: 'Y' | 'N';

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
