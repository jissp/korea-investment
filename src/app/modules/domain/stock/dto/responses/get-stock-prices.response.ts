import { ApiProperty } from '@nestjs/swagger';

export class StockPriceDto {
    @ApiProperty({
        description: '종목 코드',
    })
    stockCode: string;

    @ApiProperty({
        description: '종목명',
    })
    stockName: string;

    @ApiProperty({
        description: '현재가',
    })
    price: number;

    @ApiProperty({
        description: '전일 대비',
    })
    changePrice: number;

    @ApiProperty({
        description: '전일 대비율',
    })
    changePriceRate: number;
}

export class GetStockPricesResponse {
    @ApiProperty({
        type: StockPriceDto,
        description: '종목 정보',
        isArray: true,
    })
    data: StockPriceDto[];
}
