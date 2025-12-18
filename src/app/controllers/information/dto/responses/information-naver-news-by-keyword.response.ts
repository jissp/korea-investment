import { ApiProperty } from '@nestjs/swagger';
import { NaverApiNewsItem } from '@modules/naver';

class InformationNaverNewsByKeyword implements NaverApiNewsItem {
    @ApiProperty({
        type: String,
        description: '제목',
    })
    title: string;

    @ApiProperty({
        type: String,
        description: '뉴스 요약',
    })
    description: string;

    @ApiProperty({
        type: String,
        description: '원본 뉴스 주소',
    })
    originallink: string;

    @ApiProperty({
        type: String,
        description: '뉴스 주소',
    })
    link: string;

    @ApiProperty({
        type: String,
        description: '뉴스 발행시간',
    })
    pubDate: string;
}

class InformationNaverNewsByKeywordWithKeyword {
    @ApiProperty({
        type: String,
    })
    keyword: string;

    @ApiProperty({
        type: InformationNaverNewsByKeyword,
        isArray: true,
    })
    news: InformationNaverNewsByKeyword[];
}

export class InformationNaverNewsByKeywordResponse {
    @ApiProperty({
        type: InformationNaverNewsByKeywordWithKeyword,
        isArray: true,
    })
    data: InformationNaverNewsByKeywordWithKeyword[];
}
