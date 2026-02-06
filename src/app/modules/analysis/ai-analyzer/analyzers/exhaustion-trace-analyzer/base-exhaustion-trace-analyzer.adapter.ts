import { chunk, groupBy } from 'lodash';
import { FlowChildJob } from 'bullmq/dist/esm/interfaces/flow-job';
import { Injectable } from '@nestjs/common';
import { GeminiCliModel } from '@modules/gemini-cli';
import { Stock } from '@app/modules/repositories/stock';
import { StockInvestor } from '@app/modules/repositories/stock-investor';
import {
    AiAnalyzerQueueType,
    BaseAnalysisAdapter,
    PromptToGeminiCliBody,
} from '@app/modules/analysis/ai-analyzer';
import { formatTemplate } from '@app/common/domains';
import { ExhaustionTraceAnalyzerFlowType } from './exhaustion-trace-analyzer.types';
import {
    ExhaustionTraceAnalyzerHelper,
    StockExhaustionTraceData,
} from './exhaustion-trace-analyzer-helper';

export interface ExhaustionTraceAnalysisData {
    data: StockExhaustionTraceData[];
}

const etfNames: string[] = ['KODEX', 'TIGER', 'PLUS', 'ACE', 'RISE'];

const PROMPT_TEMPLATE = `당신은 주식 내 존재하는 세력들의 작업, 움직임, 설계 등을 20년동안 분석한 주식 퀀트 애널리스트입니다.

제공된 종목별 투자자 동향 정보를 바탕으로 세력의 흐름을 분석하십시오. 단순히 수치를 나열하는 것이 아니라, 세력의 의도와 '돈의 흐름'을 해석해야 합니다.

반드시 {currentDate} 기준으로 최신 데이터를 확인해야합니다.

# 제공 데이터: 종목별 투자자 동향 정보
{totalInvestorPrompt}

# 필수 사항

1. 정보 수집은 종목 단위로 진행하세요.

2. 응답은 반드시 [#응답 구조]($응답_구조) 형식으로 응답하세요.
- 코드 블럭은 반드시 제외하고 응답하세요.
- 설명은 핵심만 간결하게, 일반 사용자도 이해할 수 있는 수준으로 응답하세요.

3. 반드시 실존하는 데이터를 기반으로 분석하세요.
- Google 검색을 통해서 확인한 정보가 신뢰할 수 있는 데이터인지 다시 한번 확인하세요.

# 분석 지침

1. 내가 제공하는 종목별 일 단위 투자자 동향(개인, 기관, 외국인) 정보와 금일 시간 단위 외국인/외국인 기관 매수 동향 정보를 기준으로 설계 여부를 분석하세요.
- 일 단위 투자자 동향: 종가, 개인/기관/외국인 순매수량 정보
- 금일 시간 단위 외국인/외국인 기관 매수 동향: 외국인 / 외국인 기관의 순매수량 정보

2. 해당 정보 외 필요한 데이터는 당신이 가지고 있는 실시간 검색(예: Google 실시간 검색)을 통해서 데이터를 확보하세요. (예: 체결가, 체결량 등)
- 반드시 오늘 기준으로 최근 데이터여야 합니다.
- 반드시 실존하는 데이터여야합니다. 해당 데이터를 신뢰할 수 있는지 다시 한번 확인하세요.

3. 투자자 동향이 의심스러운 시간에 어떠한 이슈가 있는지 확인하세요.
- 매크로 정책(관세, 금리, 환율, 유가 등)
- 국내 상법 개정 및 밸류업 정책
- 정상회담 또는 대통령 발언
- 지정학적 / 지경학적 리스크 (전쟁, 내전 등)
- 종목 공시 정보, 실적 발표일(예상일 포함) 정보
- 그 외 기타 사항

4. 위에서 확인한 데이터를 기반으로 세력의 설계 상태를 진단하세요.
- 세력이 매집, 테스트, 펌핑, 설거지 중 어느 단계인지 분석하세요.
- 수급이 좋다고 판단되는 경우, 세력의 매집이 끝나 개미에게 물량을 고점에 넘기는 단계만 남은 것인지 판단하세요.
- 어떠한 근거로 해당 단계라고 판단했는지 근거를 제시하세요. (예: 투자자 동향, 거래량, 위에서 확인한 이슈 정보 등)

5. 해당 종목을 현재 매수해도 되는 단계인지, 아니면 매도해야하는 단계인지 판단하고 제시하세요.

6. 위험도 점수를 0점부터 10점 사이로 부여하세요.

# 응답 구조

\`\`\`
# [종목명] ([위험도 점수]/10)

## 정보
- [단계 명시]
- [판단 근거를 설명]

## 매수 여부
[매수/매도 여부를 설명하고, 그에 따른 근거를 설명]
\`\`\`
`;

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

        // 종목별로 그룹화
        const groupedStockInvestorsByStock = groupBy(
            stockInvestors,
            'stockCode',
        );

        const exhaustionTraceAnalysisData = stocks.map((stock) => {
            const stockCode = stock.shortCode;

            const stockInvestors = groupedStockInvestorsByStock[stockCode];

            return {
                stockCode,
                stockName: stock.name,
                investors: stockInvestors,
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

        const filteredStocks = stocks.filter((stock) =>
            etfNames.every((etfName) => !stock.stockName.includes(etfName)),
        );

        const totalInvestorPrompt =
            this.exhaustionTraceAnalyzerHelper.extractInvestorPrompts(
                filteredStocks,
            );

        return formatTemplate(PROMPT_TEMPLATE, {
            currentDate: currentDate.toISOString(),
            totalInvestorPrompt,
        });
    }

    protected abstract getStocks(target?: string): Promise<Stock[]>;

    protected abstract getStockInvestors(
        stocks: Stock[],
    ): Promise<StockInvestor[]>;
}
