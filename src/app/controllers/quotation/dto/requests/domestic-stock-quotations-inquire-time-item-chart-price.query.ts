import { IsBooleanString, IsEnum, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MarketDivCode } from '@modules/korea-investment/common';

export class DomesticStockQuotationsInquireTimeItemChartPriceQuery {
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

    @ApiPropertyOptional({
        type: () => Boolean,
        description: '과거 데이터 포함 여부',
        default: 'true',
    })
    @IsBooleanString()
    isIncludeOldData: boolean = true;
}
