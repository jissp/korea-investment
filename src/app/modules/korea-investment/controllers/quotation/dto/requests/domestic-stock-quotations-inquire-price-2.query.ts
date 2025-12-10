import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MarketDivCode } from '@modules/korea-investment/common';

export class DomesticStockQuotationsInquirePrice2Query {
    @ApiProperty({
        type: String,
        enum: MarketDivCode,
        description: '',
    })
    @IsEnum(MarketDivCode)
    marketDivCode: MarketDivCode;

    @ApiProperty({
        type: String,
        description: '',
    })
    @IsString()
    iscd: string;
}
