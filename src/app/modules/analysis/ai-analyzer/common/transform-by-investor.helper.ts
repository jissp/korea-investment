import { sortBy } from 'lodash';
import { Injectable } from '@nestjs/common';
import { toDateByKoreaInvestmentYmd } from '@common/utils';
import { DomesticStockQuotationsInquireInvestorOutput } from '@modules/korea-investment/common';

const MAX_STOCK_INVESTOR_ITEMS = 7;
const HOUR_GB_MAP: Record<string, string> = {
    '1': '09:30',
    '2': '10:00',
    '3': '11:20',
    '4': '13:20',
    '5': '14:30',
} as const;

@Injectable()
export class TransformByInvestorHelper {
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
     */
    private extractLatestStockInvestorOutputs(
        investorOutputs: DomesticStockQuotationsInquireInvestorOutput[],
    ) {
        if (investorOutputs.length === 0) {
            throw new Error('검색된 투자자 동향 정보가 없습니다.');
        }

        const sortedInvestorOutputs = sortBy(investorOutputs, (item) =>
            new Date(toDateByKoreaInvestmentYmd(item.stck_bsop_date)).getTime(),
        ).reverse();

        return sortedInvestorOutputs.slice(0, MAX_STOCK_INVESTOR_ITEMS);
    }

    /**
     * 시간 구분 코드를 시간으로 변환합니다.
     * @param hourGb
     */
    hourGbToTime(hourGb: string): string {
        const time = HOUR_GB_MAP[hourGb];
        if (!time) {
            throw new Error(`Invalid hourGb: ${hourGb}`);
        }
        return time;
    }
}
