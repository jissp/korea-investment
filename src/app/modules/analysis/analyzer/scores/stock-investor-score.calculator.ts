import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { toDateYmdByDate } from '@common/utils';
import { KoreaInvestmentCalendarService } from '@app/modules/repositories/korea-investment-calendar';
import { Stock } from '@app/modules/repositories/stock';
import {
    StockInvestor,
    StockInvestorService,
} from '@app/modules/repositories/stock-investor';
import { BaseCalculator, CalculateResult } from '../base-calculator.interface';

interface InitResults {
    stockInvestors: StockInvestor[];
}

@Injectable()
export class StockInvestorScoreCalculator implements BaseCalculator<InitResults> {
    private readonly fieldWeights = {
        person: 0.35, // 개인 매수 = 위험
        foreigner: -0.25, // 외인 매도 = 위험
        privateEquity: -0.1, // 사모펀드 탈출 = 위험
        etc: -0.1, // 기타법인 탈출 = 위험
        investmentTrust: -0.05, // 투신 탈출 = 위험
        fund: -0.12,
        financialInvestment: -0.01,
        insurance: -0.01,
        bank: -0.005,
        merchantBank: -0.005,
    };
    private readonly timeWeights = [1.5, 1.3, 1, 0.9, 0.7, 0.6, 0.5];

    private readonly logger = new Logger(StockInvestorScoreCalculator.name);

    constructor(
        private readonly calendarService: KoreaInvestmentCalendarService,
        private readonly stockInvestorService: StockInvestorService,
    ) {}

    public async init(stock: Stock): Promise<InitResults> {
        const latestOpenDay =
            await this.calendarService.getLatestBusinessDayByDate({
                date: toDateYmdByDate({
                    separator: '-',
                }),
                isImportToday: false,
            });
        if (!latestOpenDay) {
            throw new NotFoundException('Not found KoreaInvestmentHoliday');
        }

        const stockInvestors =
            await this.stockInvestorService.getListByStockCode({
                stockCode: stock.shortCode,
                limit: 7,
            });

        return {
            stockInvestors,
        };
    }

    calculate({ stockInvestors }: InitResults): CalculateResult {
        const supplyContribution = this.calculateInvestors(stockInvestors);
        const priceContribution = this.calculatePrice(stockInvestors);

        const finalScore = supplyContribution * 0.8 + priceContribution * 0.2;

        return {
            score: finalScore,
            scoreText: this.interpretScore(finalScore),
        };
    }

    /**
     * 투자자 동향 정보를 기반으로 수급 점수를 계산합니다.
     * @param stockInvestors
     * @private
     */
    private calculateInvestors(stockInvestors: StockInvestor[]) {
        const timeWeightSum = this.timeWeights.reduce((a, b) => a + b, 0);

        const weightedRiskScore = stockInvestors.reduce(
            (acc, stockInvestor, idx) => {
                const timeWeight = this.timeWeights[idx];

                // 주체별 (순매수 / 거래량) * 가중치 합산
                const totalRiskBias = Object.entries(this.fieldWeights).reduce(
                    (sum, [key, weight]) => {
                        const ratio =
                            stockInvestor[key] / stockInvestor.tradeVolume;
                        return sum + ratio * weight;
                    },
                    0,
                );

                // 비중 합산 1%(0.01) 당 10점 부여
                const dailyScore = Math.min(
                    Math.max((totalRiskBias / 0.01) * 10, 0),
                    10,
                );

                return acc + dailyScore * timeWeight;
            },
            0,
        );

        return Number((weightedRiskScore / timeWeightSum).toFixed(2));
    }

    /**
     * 투자자 동향 정보 내 종가, 고가, 저가 데이터를 기준으로 가격 점수를 계산합니다.
     * @param stockInvestors
     * @private
     */
    private calculatePrice(stockInvestors: StockInvestor[]) {
        const timeWeightSum = this.timeWeights.reduce((a, b) => a + b, 0);

        const priceRiskMomentum = stockInvestors.reduce(
            (acc, stockInvestor, idx) => {
                const timeWeight = this.timeWeights[idx];
                const priceRange =
                    stockInvestor.highPrice - stockInvestor.lowPrice;

                if (priceRange === 0) return acc;

                // 윗꼬리 위치 (0~1) * 10점 만점 환산
                const dumpPosition =
                    (stockInvestor.highPrice - stockInvestor.price) /
                    priceRange;

                return acc + dumpPosition * 10 * timeWeight;
            },
            0,
        );

        return priceRiskMomentum / timeWeightSum;
    }

    private interpretScore(score: number) {
        if (score <= 2.0)
            return '🔥 매수 신호: 기관·외인 순매수로 강한 수급 개선';
        if (score <= 4.5) return '✅ 긍정: 안정적인 기관·외인 수급 흐름';
        if (score <= 7.0) return '⚠️ 주의: 혼재된 수급, 개별 동향 확인 필요';

        return '💤 약한 신호: 개인 중심의 약세 수급';
    }
}
