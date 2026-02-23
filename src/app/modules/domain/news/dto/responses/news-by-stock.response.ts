import { ApiProperty } from '@nestjs/swagger';
import { News } from '@app/modules/repositories/news-repository';

export class NewsWithStock {
    @ApiProperty({
        type: String,
        description: '종목 코드',
    })
    stockCode: string;

    @ApiProperty({
        type: String,
        description: '종목명',
    })
    stockName: string;

    @ApiProperty({
        type: News,
        isArray: true,
    })
    news: News[];
}

export class NewsByStockResponse {
    @ApiProperty({
        type: NewsWithStock,
        isArray: true,
    })
    data: NewsWithStock[];
}
