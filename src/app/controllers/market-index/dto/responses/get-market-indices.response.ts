import { ApiProperty } from '@nestjs/swagger';
import { MarketIndex } from '@app/modules/repositories/market-index';

export class GetMarketIndicesResponse {
    @ApiProperty({
        type: MarketIndex,
        isArray: true,
    })
    data: MarketIndex[];
}
