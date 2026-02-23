import { ApiProperty } from '@nestjs/swagger';
import { Keyword } from '@app/modules/repositories/keyword';

export class GetKeywordsResponse {
    @ApiProperty({
        type: Keyword,
        isArray: true,
    })
    data: Keyword[];
}
