import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { KoreaInvestmentCollectorSocket } from '@app/modules/korea-investment-collector';

@Injectable()
export class UnsubscribeStockUseCase implements BaseUseCase<string, void> {
    constructor(
        private readonly koreaInvestmentCollectorSocket: KoreaInvestmentCollectorSocket,
    ) {}

    async execute(stockCode: string): Promise<void> {
        await this.koreaInvestmentCollectorSocket.unsubscribe(stockCode);
    }
}
