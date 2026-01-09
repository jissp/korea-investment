import { ApiProperty } from '@nestjs/swagger';
import { News } from '@app/modules/repositories/news';

class NewsWithKeyword {
    @ApiProperty({
        type: String,
        description: '키워드',
    })
    keyword: string;

    @ApiProperty({
        type: News,
        isArray: true,
    })
    news: News[];
}

export class NewsByKeywordResponse {
    @ApiProperty({
        type: NewsWithKeyword,
        isArray: true,
    })
    data: NewsWithKeyword[];
}
