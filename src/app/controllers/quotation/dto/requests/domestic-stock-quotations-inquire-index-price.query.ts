import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DomesticStockQuotationsInquireIndexPriceQuery {
    @ApiProperty({
        type: String,
        description: '',
    })
    @IsString()
    iscd: string;
}
