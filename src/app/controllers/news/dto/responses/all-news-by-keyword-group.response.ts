import { ApiProperty } from '@nestjs/swagger';
import { News } from '@app/modules/repositories/news';

class NewsWithKeywordGroup {
    @ApiProperty({
        type: String,
        description: '키워드 그룹명',
    })
    keywordGroupName: string;

    @ApiProperty({
        type: News,
        isArray: true,
    })
    news: News[];
}

export class AllNewsByKeywordGroupResponse {
    @ApiProperty({
        type: NewsWithKeywordGroup,
        isArray: true,
    })
    data: NewsWithKeywordGroup[];
}
