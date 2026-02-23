import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { StockService } from '@app/modules/repositories/stock';
import { AnalyzerService } from '@app/modules/analysis/analyzer';

interface StockScoresData {
    exhaustionTraceScore: {
        score: number;
        scoreText: string;
    };
}

@Injectable()
export class GetStockScoresUseCase implements BaseUseCase<
    string,
    StockScoresData
> {
    constructor(
        private readonly stockService: StockService,
        private readonly analyzerService: AnalyzerService,
    ) {}

    async execute(stockCode: string): Promise<StockScoresData> {
        const stock = await this.stockService.getStock(stockCode);

        const exhaustionTraceScore =
            await this.analyzerService.getExhaustionTraceScore(stock!);

        return {
            exhaustionTraceScore,
        };
    }
}
