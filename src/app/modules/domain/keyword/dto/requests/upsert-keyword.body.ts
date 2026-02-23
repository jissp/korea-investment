import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpsertKeywordBody {
    @ApiProperty({
        type: String,
        description: '키워드',
    })
    @IsString()
    keyword: string;
}
