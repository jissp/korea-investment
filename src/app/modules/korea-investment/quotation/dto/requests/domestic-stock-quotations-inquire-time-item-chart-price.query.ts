import { MarketDivCode } from '@modules/korea-investment/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsEnum, IsString } from 'class-validator';

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
    })
    @IsBooleanString()
    isIncludeOldData: boolean;
}
