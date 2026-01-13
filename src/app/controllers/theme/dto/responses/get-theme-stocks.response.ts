import { ApiProperty } from '@nestjs/swagger';
import { ThemeStock } from '@app/modules/repositories/theme';

export class GetThemeStocksResponse {
    @ApiProperty({
        type: ThemeStock,
        isArray: true,
    })
    data: ThemeStock[];
}
