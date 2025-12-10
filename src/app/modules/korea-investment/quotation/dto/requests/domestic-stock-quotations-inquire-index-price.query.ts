import { MarketDivCode } from '@modules/korea-investment/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class DomesticStockQuotationsInquireIndexPriceQuery {
    @ApiProperty({
        type: String,
        description: '',
    })
    @IsString()
    iscd: string;
}
