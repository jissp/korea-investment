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
import { EXHAUSTION_TRACE_ANALYZER_PROMPT } from './prompts';

export interface ExhaustionTraceAnalysisData {
    data: StockExhaustionTraceData[];
}

const etfNames: string[] = ['KODEX', 'TIGER', 'PLUS', 'ACE', 'RISE'];

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

        return formatTemplate(EXHAUSTION_TRACE_ANALYZER_PROMPT, {
            currentDate: currentDate.toISOString(),
            totalInvestorPrompt,
        });
    }

    protected abstract getStocks(target?: string): Promise<Stock[]>;

    protected abstract getStockInvestors(
        stocks: Stock[],
    ): Promise<StockInvestor[]>;
}
