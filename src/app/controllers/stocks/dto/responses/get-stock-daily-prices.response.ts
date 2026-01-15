import { ApiProperty } from '@nestjs/swagger';

export class StockDailyPriceDto {
    @ApiProperty({
        description: '주식 영업 일자',
    })
    date: string;

    @ApiProperty({
        description: '시가',
    })
    startPrice: number;

    @ApiProperty({
        description: '종가',
    })
    closePrice: number;

    @ApiProperty({
        description: '저가',
    })
    lowPrice: number;

    @ApiProperty({
        description: '고가',
    })
    highPrice: number;

    @ApiProperty({
        description: '전일 대비',
    })
    changePrice: number;

    @ApiProperty({
        description: '전일 대비율',
    })
    changePriceRate: number;

    @ApiProperty({
        description: '외국인 순매수 수량',
    })
    foreigner: number;
}

export class GetStockDailyPricesResponse {
    @ApiProperty({
        type: StockDailyPriceDto,
        description: '종목 정보',
        isArray: true,
    })
    data: StockDailyPriceDto[];
}
