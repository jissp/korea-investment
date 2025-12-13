import { IsBooleanString, IsEnum, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MarketDivCode } from '@modules/korea-investment/common';

export class DomesticStockQuotationsInquireTimeItemChartPriceQuery {
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

    @ApiPropertyOptional({
        type: () => Boolean,
        description: '',
        default: 'true',
    })
    @IsBooleanString()
    isIncludeOldData: boolean = true;
}
