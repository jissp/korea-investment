import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpsertFavoriteStockBody {
    @ApiProperty({
        type: String,
        description: '종목 코드',
    })
    @IsString()
    stockCode: string;
}
