import * as _ from 'lodash';
import { Pipe } from '@common/types';
import { toDateByKoreaInvestmentYmd } from '@common/utils';
import {
    DomesticStockInvestorTrendEstimateOutput2,
    DomesticStockQuotationsInquireInvestorOutput,
} from '@modules/korea-investment/korea-investment-quotation-client';

const MAX_STOCK_INVESTOR_ITEMS = 7;
const HOUR_GB_MAP: Record<string, string> = {
    '1': '09:30',
    '2': '10:00',
    '3': '11:20',
    '4': '13:20',
    '5': '14:30',
} as const;

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

1. 현재 프로젝트 파일은 무시하고 당신이 가진 지식으로만 답변하세요.

2. 제공 데이터: 사용자가 입력한 투자자 동향 정보
${stockInvestorPrompt}
${todayInvestorByEstimatePrompt}

3. 투자자 동향 정보를 분석하여 리포트를 작성하세요.
`;
};

export class InvestorPromptTransformer implements Pipe<PromptArgs, string> {
    /**
     * @param value
     */
    transform({
        stockName,
        stockInvestors,
        stockInvestorByEstimates,
    }: PromptArgs): string {
        const stockInvestorPrompt = this.transformByInvestor(stockInvestors);
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
        const time = this.hourGbToTime(output.bsop_hour_gb);
        const person = Number(output.frgn_fake_ntby_qty);
        const organization = Number(output.orgn_fake_ntby_qty);

        return `- ${time}: 외국인 매수량: ${person}, 기관 매수량: ${organization}`;
    }

    /**
     * 일별 투자자 동향 정보를 프롬프트로 변환합니다.
     * @param investorOutputs
     */
    transformByInvestor(
        investorOutputs: DomesticStockQuotationsInquireInvestorOutput[],
    ): string {
        const latestInvestorOutputs =
            this.extractLatestStockInvestorOutputs(investorOutputs);

        return latestInvestorOutputs
            .map((output) => this.transformByInvestorRow(output))
            .join('\n');
    }

    /**
     * 개별 투자자 동향 정보를 프롬프트로 변환합니다.
     * @param output
     * @private
     */
    private transformByInvestorRow(
        output: DomesticStockQuotationsInquireInvestorOutput,
    ) {
        const date = toDateByKoreaInvestmentYmd(output.stck_bsop_date);
        const stockPrice = Number(output.stck_clpr);
        const prsnQuantity = Number(output.prsn_ntby_qty);
        const frgnQuantity = Number(output.frgn_ntby_qty);
        const orgnQuantity = Number(output.orgn_ntby_qty);

        return `- **${date}**: 종가: ${stockPrice}, 개인 매수량: ${prsnQuantity}, 외국인 매수량: ${frgnQuantity}, 기관 매수량: ${orgnQuantity}`;
    }

    /**
     * 투자자 동향 정보를 추출합니다.
     * @param investorOutputs
     * @private
     */
    private extractLatestStockInvestorOutputs(
        investorOutputs: DomesticStockQuotationsInquireInvestorOutput[],
    ) {
        if (investorOutputs.length === 0) {
            throw new Error('검색된 투자자 동향 정보가 없습니다.');
        }

        const sortedInvestorOutputs = _.sortBy(
            investorOutputs,
            (investorOutputs) =>
                new Date(
                    toDateByKoreaInvestmentYmd(investorOutputs.stck_bsop_date),
                ).getTime(),
        ).reverse();

        return sortedInvestorOutputs.slice(0, MAX_STOCK_INVESTOR_ITEMS);
    }

    /**
     * 시간 구분 코드를 시간으로 변환합니다.
     * @param hourGb
     * @private
     */
    private hourGbToTime(hourGb: string) {
        if (HOUR_GB_MAP[hourGb]) {
            return HOUR_GB_MAP[hourGb];
        }

        throw new Error('Invalid hourGb: ' + hourGb);
    }
}
