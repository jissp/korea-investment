import { ApiProperty } from '@nestjs/swagger';

export class DeleteKeywordBody {
    @ApiProperty({
        type: String,
        description: '키워드 그룹명',
    })
    keywordGroupId?: number;
}
