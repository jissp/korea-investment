import { Injectable } from '@nestjs/common';
import { Pipe } from '@common/types';
import {
    DomesticStockInvestorTrendEstimateOutput2,
    DomesticStockQuotationsInquireInvestorOutput,
} from '@modules/korea-investment/common';
import { formatTemplate } from '@app/common/domains';
import { TransformByInvestorHelper } from '@app/modules/analysis/ai-analyzer/common';
import { RIGGED_STOCK_ISSUE_PROMPT_TEMPLATE } from '../prompts';

type RiggedStockIssueTransformerArgs = {
    stockName: string;
    stockInvestors: DomesticStockQuotationsInquireInvestorOutput[];
    stockInvestorByEstimates: DomesticStockInvestorTrendEstimateOutput2[];
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
        stockInvestorByEstimates,
    }: RiggedStockIssueTransformerArgs): string {
        const currentDate = new Date();
        const promptForInvestors =
            this.transformByInvestorHelper.transformByInvestor(stockInvestors);
        const promptForEstimate = this.transformByEstimate(
            stockInvestorByEstimates,
        );

        return formatTemplate(RIGGED_STOCK_ISSUE_PROMPT_TEMPLATE, {
            currentDate: currentDate.toISOString(),
            stockName,
            promptForInvestors,
            promptForEstimate,
        });
    }

    /**
     * 금일 외국인 투자자 동향 정보를 프롬프트로 변경합니다.
     * @param outputs
     */
    transformByEstimate(
        outputs: DomesticStockInvestorTrendEstimateOutput2[],
    ): string {
        return outputs
            .map((output) => this.transformByEstimateRow(output))
            .join('\n');
    }

    /**
     * 개별 금일 외국인 투자자 동향 정보를 프롬프트로 변경합니다.
     * @param output
     * @private
     */
    private transformByEstimateRow(
        output: DomesticStockInvestorTrendEstimateOutput2,
    ) {
        const time = this.transformByInvestorHelper.hourGbToTime(
            output.bsop_hour_gb,
        );
        const person = Number(output.frgn_fake_ntby_qty);
        const organization = Number(output.orgn_fake_ntby_qty);

        return `- ${time}: 외국인 매수량: ${person}, 기관 매수량: ${organization}`;
    }
}
