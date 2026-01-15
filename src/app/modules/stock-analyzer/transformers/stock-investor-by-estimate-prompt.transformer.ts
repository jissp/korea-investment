import { Pipe } from '@common/types';
import { DomesticStockInvestorTrendEstimateOutput2 } from '@modules/korea-investment/korea-investment-quotation-client';

export class StockInvestorByEstimatePromptTransformer implements Pipe<
    DomesticStockInvestorTrendEstimateOutput2[],
    string
> {
    /**
     * 금일 외국인 투자자 동향 정보를 프롬프트로 변경합니다.
     * @param outputs
     */
    transform(outputs: DomesticStockInvestorTrendEstimateOutput2[]): string {
        return outputs
            .map((output) => this.transformRowPrompt(output))
            .join('\n');
    }

    /**
     * 개별 금일 외국인 투자자 동향 정보를 프롬프트로 변경합니다.
     * @param output
     * @private
     */
    private transformRowPrompt(
        output: DomesticStockInvestorTrendEstimateOutput2,
    ) {
        const time = this.hourGbToTime(output.bsop_hour_gb);
        const person = Number(output.frgn_fake_ntby_qty);
        const organization = Number(output.orgn_fake_ntby_qty);

        return `- ${time}: 외국인 매수량: ${person}, 기관 매수량: ${organization}`;
    }

    private hourGbToTime(hourGb: string) {
        switch (hourGb) {
            case '1':
                return '09:30';
            case '2':
                return '10:00';
            case '3':
                return '11:20';
            case '4':
                return '13:20';
            case '5':
                return '14:30';
        }

        throw new Error('Invalid hourGb: ' + hourGb);
    }
}
