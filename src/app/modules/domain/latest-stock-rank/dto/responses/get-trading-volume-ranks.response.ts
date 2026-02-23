import { ApiProperty } from '@nestjs/swagger';
import { TradingVolumeRank } from '@app/modules/repositories/trading-volume-rank';

export class GetTradingVolumeRanksResponse {
    @ApiProperty({
        type: TradingVolumeRank,
        isArray: true,
    })
    data: TradingVolumeRank[];
}
