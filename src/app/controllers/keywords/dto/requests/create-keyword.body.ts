import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateKeywordBody {
    @ApiProperty({
        type: String,
        description: '키워드',
    })
    keyword: string;

    @ApiPropertyOptional({
        type: Number,
        description: '키워드 그룹 ID',
    })
    keywordGroupId?: number;
}
