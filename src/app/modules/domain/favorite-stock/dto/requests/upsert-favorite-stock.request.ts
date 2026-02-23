import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpsertFavoriteStockRequest {
    @ApiProperty({
        type: String,
        description: '종목 코드',
    })
    @IsString()
    stockCode: string;
}
