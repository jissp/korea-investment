import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { TradingVolumeRankService } from '@app/modules/repositories/trading-volume-rank';
import { GetTradingVolumeRanksResponse } from '../dto';

export interface GetTradingVolumeRanksParams {
    limit: number;
}

@Injectable()
export class GetTradingVolumeRanksUseCase implements BaseUseCase<
    GetTradingVolumeRanksParams,
    GetTradingVolumeRanksResponse
> {
    constructor(
        private readonly tradingVolumeRankService: TradingVolumeRankService,
    ) {}

    async execute(
        params: GetTradingVolumeRanksParams,
    ): Promise<GetTradingVolumeRanksResponse> {
        const tradingVolumeRanks =
            await this.tradingVolumeRankService.getLatestTradingVolumeRanks(
                params.limit,
            );

        return {
            data: tradingVolumeRanks,
        };
    }
}
