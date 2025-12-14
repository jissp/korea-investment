import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DomesticStockQuotationsInquireIndexPriceQuery {
    @ApiProperty({
        type: String,
        description: '종목 코드',
    })
    @IsString()
    iscd: string;
}
