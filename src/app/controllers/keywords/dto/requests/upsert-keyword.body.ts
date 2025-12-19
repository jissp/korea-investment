import { ApiProperty } from '@nestjs/swagger';

export class UpsertKeywordBody {
    @ApiProperty({
        type: String,
        description: '키워드',
    })
    keyword: string;
}
