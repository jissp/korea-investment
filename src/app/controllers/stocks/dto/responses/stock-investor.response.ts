import { ApiProperty } from '@nestjs/swagger';

class StockInvestorItem {
    @ApiProperty({
        type: String,
        description: '주식 영업 일자 (YYYY-MM-DD)',
        example: '2026-01-07',
    })
    date: string;

    @ApiProperty({
        type: Number,
        description: '주식 종가',
        example: 75000,
    })
    stockPrice: number;

    @ApiProperty({
        type: Number,
        description: '개인 순매수 수량',
        example: 1500000,
    })
    prsnQuantity: number;

    @ApiProperty({
        type: Number,
        description: '외국인 순매수 수량',
        example: -500000,
    })
    frgnQuantity: number;

    @ApiProperty({
        type: Number,
        description: '기관계 순매수 수량',
        example: -1000000,
    })
    orgnQuantity: number;
}

export class StockInvestorResponse {
    @ApiProperty({
        type: StockInvestorItem,
        isArray: true,
        description: '투자자 동향 데이터 (최신순 정렬)',
    })
    data: StockInvestorItem[];
}
