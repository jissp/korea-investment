import { ApiProperty } from '@nestjs/swagger';
import { Theme } from '@app/modules/repositories/theme';

export class GetThemesResponse {
    @ApiProperty({
        type: Theme,
        isArray: true,
    })
    data: Theme[];
}
