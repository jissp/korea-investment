import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { MarketIndexService } from '@app/modules/repositories/market-index';
import { GetMarketIndicesResponse } from '../dto';

@Injectable()
export class GetDomesticIndicesUseCase implements BaseUseCase<
    void,
    GetMarketIndicesResponse
> {
    constructor(private readonly marketIndexService: MarketIndexService) {}

    async execute(): Promise<GetMarketIndicesResponse> {
        const marketIndices =
            await this.marketIndexService.getTodayDomesticIndices();

        return {
            data: marketIndices,
        };
    }
}
