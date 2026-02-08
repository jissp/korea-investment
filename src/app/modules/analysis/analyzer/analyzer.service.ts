import { Injectable } from '@nestjs/common';
import { StockInvestorScoreCalculator } from '@app/modules/analysis/analyzer/scores';
import { Stock } from '@app/modules/repositories/stock';
import { CalculateResult } from '@app/modules/analysis/analyzer/base-calculator.interface';

@Injectable()
export class AnalyzerService {
    constructor(
        private readonly exhaustionTraceScoreCalculator: StockInvestorScoreCalculator,
    ) {}

    /**
     * 종목의 수급 점수 계산 (일일 기반)
     */
    async getExhaustionTraceScore(stock: Stock): Promise<CalculateResult> {
        const initResults =
            await this.exhaustionTraceScoreCalculator.init(stock);

        return this.exhaustionTraceScoreCalculator.calculate(initResults);
    }
}
