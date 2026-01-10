import { ApiProperty } from '@nestjs/swagger';
import { MostViewedStock } from '@app/modules/repositories/most-viewed-stock';

export class DomesticStockRankingHtsTopViewResponse {
    @ApiProperty({
        type: MostViewedStock,
        isArray: true,
    })
    data: MostViewedStock[];
}
