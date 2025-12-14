import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DomesticStockQuotationsInquireIndexTimePriceQuery {
    @ApiProperty({
        type: String,
        enum: ['0001', '1001', '2001', '3003'],
        description: '종목 코드',
    })
    @IsString()
    @IsEnum(['0001', '1001', '2001', '3003'])
    iscd: '0001' | '1001' | '2001' | '3003';

    @ApiPropertyOptional({
        type: String,
        description: '입력 시간',
        default: '60',
    })
    @IsString()
    @IsOptional()
    timeframe: '1' | '5' | '15' | '30' | '60' | '300' | '600' = '60';
}
