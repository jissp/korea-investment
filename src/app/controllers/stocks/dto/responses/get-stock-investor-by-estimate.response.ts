import { ApiProperty } from '@nestjs/swagger';

export class StockInvestorByEstimateDto {
    @ApiProperty({
        description: 'hour',
    })
    time!: string;

    @ApiProperty({
        description: '종목 코드',
    })
    stockCode!: string;

    @ApiProperty({
        description: '종목명',
    })
    stockName!: string;

    @ApiProperty({
        description: '외인 매수량',
    })
    person!: number;

    @ApiProperty({
        description: '기관 매수량',
    })
    organization!: number;

    @ApiProperty({
        description: '합산 수량',
    })
    sum!: number;
}

export class GetStockInvestorByEstimateResponse {
    @ApiProperty({
        type: StockInvestorByEstimateDto,
        description: '종목별 외인기관 추정가집계 정보',
        isArray: true,
    })
    data: StockInvestorByEstimateDto[];
}
