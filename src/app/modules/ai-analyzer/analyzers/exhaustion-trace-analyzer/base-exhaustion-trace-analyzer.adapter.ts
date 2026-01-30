import { chunk, groupBy } from 'lodash';
import { FlowChildJob } from 'bullmq/dist/esm/interfaces/flow-job';
import { Injectable } from '@nestjs/common';
import { GeminiCliModel } from '@modules/gemini-cli';
import { Stock } from '@app/modules/repositories/stock';
import {
    StockDailyInvestor,
    StockHourForeignerInvestor,
} from '@app/modules/repositories/stock-investor';
import {
    AiAnalyzerQueueType,
    BaseAnalysisAdapter,
    PromptToGeminiCliBody,
} from '@app/modules/ai-analyzer';
import { ExhaustionTraceAnalyzerFlowType } from './exhaustion-trace-analyzer.types';
import {
    ExhaustionTraceAnalyzerHelper,
    StockExhaustionTraceData,
} from './exhaustion-trace-analyzer-helper';

export interface ExhaustionTraceAnalysisData {
    data: StockExhaustionTraceData[];
}

@Injectable()
export abstract class BaseExhaustionTraceAnalyzerAdapter implements BaseAnalysisAdapter<ExhaustionTraceAnalysisData> {
    protected abstract readonly logger;

    protected constructor(
        protected readonly exhaustionTraceAnalyzerHelper: ExhaustionTraceAnalyzerHelper,
    ) {}

    public async collectData(
        target: string,
    ): Promise<ExhaustionTraceAnalysisData> {
        const stocks = await this.getStocks(target);

        const stockInvestors = await this.getStockInvestors(stocks);
        const stockHourForeignerInvestors =
            await this.getStockHourForeignerInvestors(stocks);

        // 종목별로 그룹화
        const groupedStockInvestorsByStock = groupBy(
            stockInvestors,
            'stockCode',
        );
        const stockHourForeignerInvestorMap = groupBy(
            stockHourForeignerInvestors,
            (investor) => investor.stockCode,
        );

        const exhaustionTraceAnalysisData = stocks.map((stock) => {
            const stockCode = stock.shortCode;

            const stockInvestors = groupedStockInvestorsByStock[stockCode];
            const stockHourForeignerInvestors =
                stockHourForeignerInvestorMap[stockCode] || [];

            return {
                stockCode,
                stockName: stock.name,
                investors: stockInvestors,
                hourForeignerInvestors: stockHourForeignerInvestors,
            };
        });

        return {
            data: exhaustionTraceAnalysisData,
        };
    }

    public abstract transformToTitle(): string;

    /**
     * 데이터를 FlowChildJob으로 변환합니다.
     */
    public transformToFlowChildJob({
        data,
    }: ExhaustionTraceAnalysisData): FlowChildJob {
        const queueName = ExhaustionTraceAnalyzerFlowType.Request;

        return {
            queueName,
            name: queueName,
            children: chunk(data, 10).map((chunk) => ({
                queueName: AiAnalyzerQueueType.PromptToGeminiCli,
                name: `세력 추적 분석`,
                data: {
                    prompt: this.transformToPrompt(chunk),
                    model: GeminiCliModel.Gemini3Flash,
                } as PromptToGeminiCliBody,
            })),
        };
    }

    /**
     * 투자자 동향 데이터를 프롬프트로 변환합니다.
     */
    public transformToPrompt(stocks: StockExhaustionTraceData[]): string {
        const currentDate = new Date();

        const filteredStocks = stocks.filter(
            (stock) =>
                !stock.stockName.includes('KODEX') &&
                !stock.stockName.includes('TIGER'),
        );

        const totalInvestorPrompt =
            this.exhaustionTraceAnalyzerHelper.extractInvestorPrompts(
                filteredStocks,
            );

        return `
당신은 20년 경력의 시장 분석 전문가입니다. 
제공된 종목별 투자자 동향 정보를 바탕으로 세력의 [매집 → 가격 설계 → 설거지] 사이클 중 현재 위치를 정확히 진단하십시오.
단순히 수치를 나열하는 것이 아니라, 세력의 의도와 '돈의 흐름'을 해석해야 합니다.

반드시 ${currentDate.toISOString()} 기준으로 최신 데이터를 확인해야합니다.

# 제공 데이터: 종목별 투자자 동향 정보
${totalInvestorPrompt}

# 필수 사항
- 제공된 데이터를 기반으로 확인이 불가능한 경우 Google 검색 서비스를 이용해서 데이터를 확인하세요.
- Google 검색 서비스를 이용할 경우 반드시 최신 데이터를 기반으로 확인해야합니다.
- Google 검색 서비스를 이용할 경우 반드시 존재하는 데이터를 기반으로 확인해야합니다.
- 모르는 경우 모른다고 답변하세요.
- 억지로 데이터를 연결하지 마세요.
- 모든 설명은 개조식으로 나열하세요.
- 일반인이 이해하기 쉬운 문장으로 핵심만 간략하게 설명하세요.

# 분석 지침

1. 돈의 주체 변화: 외국인, 기관이 던지는 물량을 개인이 '고점'에서 받고 있는지, 아니면 '저점'에서 세력이 매집 중인지 판별.

2. 거래량의 진실: 주가 상승 폭 대비 거래량이 과도하게 터지며 위꼬리가 달리는지(물량 넘기기), 아니면 거래량 없이 주가를 누르는지(개미 털기) 분석.

3. 가격 설계 구조: 현재 주가가 세력의 평균 단가 대비 어느 위치에 있으며, 추가 슈팅을 위한 '눌림목'인지 '엑시트(Exit)' 구간인지 확인.

4. 설거지 위험 점수와 근거를 분석하세요.
- 설거지 위험 점수는 0점~10점 사이로 매겨주세요.
- 종목의 수급이 좋아도 현재 수급이 매집 단계인지, 설거지 단계인지, 아니면 다른 무언가가 있는지 만약을 대비해서 확인해야 합니다.
- 종목을 매수해도 되는 타이밍인지 등 대응 전략을 제안하세요.

5. 제공된 모든 종목을 대상으로 종목별로 응답 형식에 맞게 응답하세요. 이 때 코드 블록은 반드시 제외해야 합니다.

# 응답 형식
\`\`\`
## [종목명] ([설거지 위험 점수]/10)
- [설거지 근거 설명]
- [거래량 분석]

### 대응 전략
- [강력 매수 / 분할 매수 / 관망 / 즉시 매도] 중 선택 및 이유 설명

\`\`\`
`;
    }

    protected abstract getStocks(target?: string): Promise<Stock[]>;

    protected abstract getStockInvestors(
        stocks: Stock[],
    ): Promise<StockDailyInvestor[]>;

    protected abstract getStockHourForeignerInvestors(
        stocks: Stock[],
    ): Promise<StockHourForeignerInvestor[]>;
}
