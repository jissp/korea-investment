import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { FavoriteType } from './favorite-stock.types';

@Entity('favorite_stocks')
export class FavoriteStock {
    /**
     * 고유 식별 번호
     */
    @PrimaryGeneratedColumn()
    @ApiProperty({
        description: '고유 식별 번호',
    })
    id!: number;

    /**
     * 즐겨찾기 유형
     */
    @Column({ enum: FavoriteType })
    @ApiProperty({
        enum: FavoriteType,
        description: '즐겨찾기 유형',
    })
    type!: FavoriteType;

    /**
     * 종목 코드
     */
    @Column({ type: 'varchar', length: 20 })
    @ApiProperty({
        description: '종목 코드',
    })
    stockCode!: string;

    /**
     * 종목명
     */
    @Column({ type: 'varchar', length: 255 })
    @ApiProperty({
        description: '종목명',
    })
    stockName!: string;

    @CreateDateColumn({
        type: 'datetime',
        default: 'CURRENT_TIMESTAMP()',
    })
    @ApiProperty({ type: Date, description: '생성일' })
    createdAt!: Date;
}
