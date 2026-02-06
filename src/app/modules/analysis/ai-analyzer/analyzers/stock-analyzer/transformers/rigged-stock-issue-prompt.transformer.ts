import { Injectable } from '@nestjs/common';
import { Pipe } from '@common/types';
import { DomesticStockQuotationsInquireInvestorOutput } from '@modules/korea-investment/common';
import { formatTemplate } from '@app/common/domains';
import { TransformByInvestorHelper } from '@app/modules/analysis/ai-analyzer/common';
import { RIGGED_STOCK_ISSUE_PROMPT_TEMPLATE } from '../prompts';

type RiggedStockIssueTransformerArgs = {
    stockName: string;
    stockInvestors: DomesticStockQuotationsInquireInvestorOutput[];
};

@Injectable()
export class RiggedStockIssuePromptTransformer implements Pipe<
    RiggedStockIssueTransformerArgs,
    string
> {
    constructor(
        private readonly transformByInvestorHelper: TransformByInvestorHelper,
    ) {}

    /**
     * @param value
     */
    transform({
        stockName,
        stockInvestors,
    }: RiggedStockIssueTransformerArgs): string {
        const currentDate = new Date();
        const promptForInvestors =
            this.transformByInvestorHelper.transformByInvestor(stockInvestors);

        return formatTemplate(RIGGED_STOCK_ISSUE_PROMPT_TEMPLATE, {
            currentDate: currentDate.toISOString(),
            stockName,
            promptForInvestors,
        });
    }
}
