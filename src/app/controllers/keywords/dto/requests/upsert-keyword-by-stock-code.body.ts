import { ApiProperty } from '@nestjs/swagger';

export class UpsertKeywordByStockCodeBody {
    @ApiProperty({
        type: String,
        description: '종목 코드',
    })
    stockCode: string;
}
