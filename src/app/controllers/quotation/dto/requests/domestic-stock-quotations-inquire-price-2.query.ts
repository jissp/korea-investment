import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MarketDivCode } from '@modules/korea-investment/common';

export class DomesticStockQuotationsInquirePrice2Query {
    @ApiProperty({
        type: String,
        enum: MarketDivCode,
        description: '조건 시장 분류 코드',
    })
    @IsEnum(MarketDivCode)
    marketDivCode: MarketDivCode;

    @ApiProperty({
        type: String,
        description: '종목 코드',
    })
    @IsString()
    iscd: string;
}
