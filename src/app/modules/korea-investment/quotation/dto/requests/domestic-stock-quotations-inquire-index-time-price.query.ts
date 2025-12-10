import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class DomesticStockQuotationsInquireIndexTimePriceQuery {
    @ApiProperty({
        type: String,
        enum: ['0001', '1001', '2001', '3003'],
        description: '',
    })
    @IsString()
    @IsEnum(['0001', '1001', '2001', '3003'])
    iscd: '0001' | '1001' | '2001' | '3003';

    @ApiProperty({
        type: String,
        description: '',
    })
    @IsString()
    timeframe: '1' | '5' | '15' | '30' | '60' | '300' | '600';
}
