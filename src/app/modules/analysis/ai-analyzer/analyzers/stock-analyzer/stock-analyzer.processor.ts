import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { normalizeError } from '@common/domains';
import { GeminiCliModel, GeminiCliService } from '@modules/gemini-cli';
import { formatTemplate } from '@app/common/domains';
import { TransformByInvestorHelper } from '@app/modules/analysis/ai-analyzer/common';
import { AccountStockService } from '@app/modules/repositories/account';
import { Stock } from '@app/modules/repositories/stock';
import { StockAnalyzerFlowType } from './stock-analyzer.types';
import { StockAnalysisData } from './stock-analyzer.adapter';
import { STOCK_ANALYZER_PROMPT_TEMPLATE } from './prompts';

@Processor(StockAnalyzerFlowType.Request)
export class StockAnalyzerProcessor extends WorkerHost {
    private readonly logger = new Logger(StockAnalyzerProcessor.name);

    constructor(
        private readonly geminiCliService: GeminiCliService,
        private readonly transformByInvestorHelper: TransformByInvestorHelper,
        private readonly accountStockService: AccountStockService,
    ) {
        super();
    }

    async process(job: Job<StockAnalysisData>) {
        this.logger.log('processing');

        try {
            const { stock, stockInvestors } = job.data;
            const results = await this.getChildrenValues(job);
            const accountStockPrompt =
                await this.buildAccountStockPrompt(stock);

            const mergedResultPrompts = [...results].join('\n\n');

            const promptForInvestors =
                this.transformByInvestorHelper.transformByInvestor(
                    stockInvestors,
                );

            const requestPrompt = formatTemplate(
                STOCK_ANALYZER_PROMPT_TEMPLATE,
                {
                    promptForInvestors,
                    mergedResultPrompts,
                    accountStockPrompt,
                },
            );

            return await this.geminiCliService.requestPrompt(requestPrompt, {
                model: GeminiCliModel.Gemini3Pro,
            });
        } catch (error) {
            this.logger.error(normalizeError(error));
            throw error;
        } finally {
            this.logger.log('processed');
        }
    }

    /**
     * @param job
     * @private
     */
    private async getChildrenValues(job: Job) {
        const childrenValues = await job.getChildrenValues<string>();

        return Object.values(childrenValues);
    }

    /**
     * 보유중인 종목 정보(프롬프트)를 응답합니다.
     * @param stock
     * @private
     */
    private async buildAccountStockPrompt(stock: Stock): Promise<string> {
        const accountStock = await this.accountStockService.getAccountStock(
            stock.shortCode,
        );

        if (accountStock) {
            const { quantity, pchsAvgPric, price, evluAmt } = accountStock;

            return `- 보유 수량: ${quantity}주\n- 매입 평균가: ${pchsAvgPric}원\n- 현재가: ${price}원\n- 평가 금액: ${evluAmt}원`;
        }

        return '- 보유하고 있지 않음';
    }
}
