import { ApiProperty } from '@nestjs/swagger';

export class UpsertFavoriteStockBody {
    @ApiProperty({
        type: String,
        description: '종목 코드',
    })
    stockCode: string;
}
