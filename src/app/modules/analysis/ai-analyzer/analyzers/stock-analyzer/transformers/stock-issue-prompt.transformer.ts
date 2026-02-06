import { Injectable } from '@nestjs/common';
import { Pipe } from '@common/types';
import { formatTemplate } from '@app/common/domains';
import { STOCK_ISSUE_PROMPT_TEMPLATE } from '../prompts';

type AnalyzeStockTransformerArgs = {
    stockName: string;
};

@Injectable()
export class StockIssuePromptTransformer implements Pipe<
    AnalyzeStockTransformerArgs,
    string
> {
    /**
     * @param value
     */
    transform({ stockName }: AnalyzeStockTransformerArgs): string {
        const currentDate = new Date();

        return formatTemplate(STOCK_ISSUE_PROMPT_TEMPLATE, {
            currentDate: currentDate.toISOString(),
            stockName,
        });
    }
}
