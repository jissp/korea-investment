import { ApiProperty } from '@nestjs/swagger';
import { KeywordGroupNews } from '@app/modules/repositories/news';

class NewsWithKeywordGroup {
    @ApiProperty({
        type: String,
        description: '키워드 그룹명',
    })
    keywordGroupName: string;

    @ApiProperty({
        type: KeywordGroupNews,
        isArray: true,
    })
    news: KeywordGroupNews[];
}

export class NewsByKeywordGroupResponse {
    @ApiProperty({
        type: NewsWithKeywordGroup,
    })
    data: NewsWithKeywordGroup;
}
