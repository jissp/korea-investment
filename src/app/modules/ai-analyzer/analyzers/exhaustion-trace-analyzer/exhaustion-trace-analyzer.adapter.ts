import * as _ from 'lodash';
import { FlowChildJob } from 'bullmq/dist/esm/interfaces/flow-job';
import { Injectable, Logger } from '@nestjs/common';
import { GeminiCliModel } from '@modules/gemini-cli';
import {
    StockDailyInvestor,
    StockDailyInvestorService,
} from '@app/modules/repositories/stock-investor';
import {
    AiAnalyzerQueueType,
    BaseAnalysisAdapter,
    PromptToGeminiCliBody,
} from '@app/modules/ai-analyzer';

interface StockExhaustionTraceData {
    stockCode: string;
    stockName: string;
    investors: StockDailyInvestor[];
}

export interface ExhaustionTraceAnalysisData {
    stocks: StockExhaustionTraceData[];
}

@Injectable()
export class ExhaustionTraceAnalyzerAdapter implements BaseAnalysisAdapter<ExhaustionTraceAnalysisData> {
    private readonly logger = new Logger(ExhaustionTraceAnalyzerAdapter.name);

    constructor(
        private readonly stockDailyInvestorService: StockDailyInvestorService,
    ) {}

    /**
     * 최근 7일간 모든 종목의 투자자 동향 데이터를 수집합니다.
     */
    async collectData(): Promise<ExhaustionTraceAnalysisData> {
        const stockInvestors =
            await this.stockDailyInvestorService.getAllStockDailyInvestorsByDays(
                7,
            );

        // 종목별로 그룹화
        const groupedByStock = _.groupBy(stockInvestors, 'stockCode');

        const stocks: StockExhaustionTraceData[] = Object.entries(
            groupedByStock,
        ).map(([stockCode, investors]) => {
            const firstInvestor = investors[0];

            return {
                stockCode,
                stockName: firstInvestor.stockName,
                investors,
            };
        });

        return { stocks };
    }

    public transformToTitle() {
        return `전체 종목 세력 추적 분석`;
    }

    /**
     * 데이터를 FlowChildJob으로 변환합니다.
     */
    public transformToFlowChildJob({
        stocks,
    }: ExhaustionTraceAnalysisData): FlowChildJob {
        return {
            queueName: AiAnalyzerQueueType.PromptToGeminiCli,
            name: `세력 추적 분석`,
            data: {
                prompt: this.transformToPrompt(stocks),
                model: GeminiCliModel.Gemini3Flash,
            } as PromptToGeminiCliBody,
        };
    }

    /**
     * 투자자 동향 데이터를 프롬프트로 변환합니다.
     */
    private transformToPrompt(stocks: StockExhaustionTraceData[]): string {
        const currentDate = new Date();

        const filteredStocks = stocks.filter(
            (stock) =>
                !stock.stockName.includes('KODEX') &&
                !stock.stockName.includes('TIGER'),
        );

        const totalInvestorPrompt = filteredStocks
            .map((stock) => {
                const stockInvestorPrompt = stock.investors
                    .map((inv) => {
                        return `- **${inv.date}**: 종가: ${inv.price}, 개인 매수량: ${inv.person}, 외국인 매수량: ${inv.foreigner}, 기관 매수량: ${inv.organization}`;
                    })
                    .join('\n');

                return `${stock.stockName} 종목 투자자 동향 \n\n ${stockInvestorPrompt}`;
            })
            .join('\n\n');

        return `당신은 20년 경력의 주식/코인 시장 분석 전문가입니다. 
아래 제공하는 투자자 동향 데이터를 바탕으로 현재 상황이 **'추가 상승을 위한 매집/눌림목'**인지, 아니면 '개미에게 물량을 떠넘기는 설거지' 단계인지 분석해 주세요.

반드시 ${currentDate.toISOString()} 기준으로 최신 데이터를 확인해야하며, 아래 분석 지침 순서를 따라 분석해야 합니다.

# 제공 데이터: 종목별 투자자 동향 정보
${totalInvestorPrompt}

# 분석 지침

1. 수급 이탈 확인: 외인/기관의 매도세와 개인의 매수세가 교차하는 지점을 확인하세요.

2. 거래량 분석: 주가는 고점인데 거래량이 터지면서 음봉이 발생하는지 분석하세요.

3. 체결 강도 및 호가: 큰 물량의 매도세가 반복적으로 나오는지 확인하세요.

4. 설거지 확률을 별 0개에서 5개로 점수를 매기고, 대응 전략 제안.

5. 제공된 모든 종목을 대상으로 종몰별로 응답 형식에 맞게 응답하세요. 이 때 코드 블록은 반드시 제외해야 합니다.

# 응답 형식
\`\`\`
### [종목명1]: [설거지 확률]
[근거를 간략하게 설명]

### [종목명2]: [설거지 확률]
[근거를 간략하게 설명]

[...]
\`\`\`
`;
    }
}
