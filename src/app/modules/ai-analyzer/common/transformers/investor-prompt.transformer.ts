import { Injectable } from '@nestjs/common';
import { Pipe } from '@common/types';
import {
    DomesticStockInvestorTrendEstimateOutput2,
    DomesticStockQuotationsInquireInvestorOutput,
} from '@modules/korea-investment/korea-investment-quotation-client';
import { TransformByInvestorHelper } from '@app/modules/ai-analyzer/common';

type PromptArgs = {
    stockName: string;
    stockInvestors: DomesticStockQuotationsInquireInvestorOutput[];
    stockInvestorByEstimates: DomesticStockInvestorTrendEstimateOutput2[];
};

const PROMPT = ({
    stockName,
    stockInvestorPrompt,
    todayInvestorByEstimatePrompt,
}: {
    stockName: string;
    stockInvestorPrompt: string;
    todayInvestorByEstimatePrompt: string;
}) => {
    const currentDate = new Date();

    return `당신은 제공된 데이터와 최신 정보를 바탕으로 종목의 흐름을 분석하는 데이터 기반 퀀트 투자 분석가입니다.

제가 제공한 투자자 동향 데이터와 ${stockName} 종목의 최신 데이터를 바탕으로 어떠한 근거로 해외/기관/개인 투자자가 유입/이탈했는지 확인하고 분석하세요.

반드시 ${currentDate.toISOString()} 기준으로 최신 데이터를 확인해야하며, 아래 분석 지침 순서를 따라 분석해야 합니다.

# 분석 지침

1. 제공 데이터: 사용자가 입력한 투자자 동향 정보
${stockInvestorPrompt}
${todayInvestorByEstimatePrompt}

2. 투자자 동향 정보를 분석하여 핵심만 간결하게 리포트를 작성하세요.
`;
};

@Injectable()
export class InvestorPromptTransformer implements Pipe<PromptArgs, string> {
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
    }: PromptArgs): string {
        const stockInvestorPrompt =
            this.transformByInvestorHelper.transformByInvestor(stockInvestors);
        const todayInvestorByEstimatePrompt = this.transformByEstimate(
            stockInvestorByEstimates,
        );

        return PROMPT({
            stockName,
            stockInvestorPrompt,
            todayInvestorByEstimatePrompt,
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
