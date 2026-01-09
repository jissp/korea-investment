import { ApiProperty } from '@nestjs/swagger';
import { News } from '@app/modules/repositories/news';

export class NewsResponse {
    @ApiProperty({
        type: News,
        isArray: true,
    })
    data: News[];
}
