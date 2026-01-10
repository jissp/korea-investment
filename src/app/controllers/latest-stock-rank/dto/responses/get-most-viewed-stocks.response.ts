import { ApiProperty } from '@nestjs/swagger';
import { MostViewedStock } from '@app/modules/repositories/most-viewed-stock';

export class GetMostViewedStocksResponse {
    @ApiProperty({
        type: MostViewedStock,
        isArray: true,
    })
    data: MostViewedStock[];
}
