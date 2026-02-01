import { Stock } from '@app/modules/repositories/stock';

export interface CalculateResult {
    score: number;
    scoreText: string;
}

export interface BaseCalculator<T = any> {
    init(stock: Stock): Promise<T>;

    calculate(data: T): CalculateResult;
}
