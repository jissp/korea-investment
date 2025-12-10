import { MarketDivCode } from '@modules/korea-investment/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

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
