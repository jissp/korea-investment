import { ApiProperty } from '@nestjs/swagger';
import { KeywordGroup } from '@app/modules/repositories/keyword';

export class GetCodesResponse {
    @ApiProperty({
        type: KeywordGroup,
        isArray: true,
    })
    data: KeywordGroup[];
}
