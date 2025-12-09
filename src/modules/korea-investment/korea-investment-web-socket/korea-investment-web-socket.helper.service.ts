import { Inject, Injectable } from '@nestjs/common';
import { Pipe } from '@common/types';
import { KoreaInvestmentConfigService } from '@modules/korea-investment/korea-investment-config';
import { koreaInvestmentWebSocketPipeMapProvider } from './korea-investment-web-socket.config';

@Injectable()
export class KoreaInvestmentWebSocketHelperService {
    constructor(
        private readonly configService: KoreaInvestmentConfigService,
        @Inject(koreaInvestmentWebSocketPipeMapProvider)
        private readonly pipeMap: Map<string, Pipe<string[], any>>,
    ) {}

    /**
     */
    public getWebSocketUrl() {
        return this.configService.getWebSocketHost();
    }

    /**
     * @param tradeId
     */
    public getPipe(tradeId: string): Pipe<string[], any> {
        if (!this.pipeMap.has(tradeId)) {
            throw new Error(`No pipe found for tradeId: ${tradeId}`);
        }

        return this.pipeMap.get(tradeId)!;
    }
}
