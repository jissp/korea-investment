import { ApiProperty } from '@nestjs/swagger';
import { NaverApiNewsItem } from '@modules/naver';

class InformationNaverNews implements NaverApiNewsItem {
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

export class InformationNaverNewsResponse {
    @ApiProperty({
        type: InformationNaverNews,
        isArray: true,
    })
    data: InformationNaverNews[];
}
