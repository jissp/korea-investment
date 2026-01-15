import * as _ from 'lodash';
import { Pipe } from '@common/types';
import { toDateByKoreaInvestmentYmd } from '@common/utils';
import { DomesticStockQuotationsInquireInvestorOutput } from '@modules/korea-investment/korea-investment-quotation-client';

export class StockInvestorPromptTransformer implements Pipe<
    DomesticStockQuotationsInquireInvestorOutput[],
    string
> {
    private readonly MAX_STOCK_INVESTOR_ITEMS = 7;

    /**
     * 일별 투자자 동향 정보를 프롬프트로 변환합니다.
     * @param investorOutputs
     */
    transform(
        investorOutputs: DomesticStockQuotationsInquireInvestorOutput[],
    ): string {
        const latestInvestorOutputs =
            this.extractLatestStockInvestorOutputs(investorOutputs);

        return latestInvestorOutputs
            .map((output) => this.transformRowPrompt(output))
            .join('\n');
    }

    /**
     * 개별 투자자 동향 정보를 프롬프트로 변환합니다.
     * @param output
     * @private
     */
    private transformRowPrompt(
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

        return sortedInvestorOutputs.slice(0, this.MAX_STOCK_INVESTOR_ITEMS);
    }
}
