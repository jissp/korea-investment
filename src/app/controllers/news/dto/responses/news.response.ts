import { ApiProperty } from '@nestjs/swagger';
import { NewsCategory, NewsItem } from '@app/modules/news';

class News implements NewsItem {
    @ApiProperty({
        description: '뉴스 ID',
    })
    articleId: string;

    @ApiProperty({
        description: '뉴스 출처',
    })
    category: NewsCategory;

    @ApiProperty({
        description: '뉴스 제목',
    })
    title: string;

    @ApiProperty({
        description: '뉴스 내용',
    })
    description?: string;

    @ApiProperty({
        description: '뉴스 링크',
    })
    link?: string;

    @ApiProperty({
        description: '뉴스 종목 코드 목록',
    })
    stockCodes: string[];

    @ApiProperty({
        description: '뉴스 생성 일시',
    })
    createdAt: string;
}

export class NewsResponse {
    @ApiProperty({
        type: News,
        isArray: true,
    })
    data: News[];
}
