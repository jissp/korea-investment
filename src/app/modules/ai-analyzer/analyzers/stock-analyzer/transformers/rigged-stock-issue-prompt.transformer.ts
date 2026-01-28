import { Injectable } from '@nestjs/common';
import { Pipe } from '@common/types';
import {
    DomesticStockInvestorTrendEstimateOutput2,
    DomesticStockQuotationsInquireInvestorOutput,
} from '@modules/korea-investment/korea-investment-quotation-client';
import { TransformByInvestorHelper } from '@app/modules/ai-analyzer/common';

type RiggedStockIssuePromptArgs = {
    stockName: string;
    stockInvestors: DomesticStockQuotationsInquireInvestorOutput[];
    stockInvestorByEstimates: DomesticStockInvestorTrendEstimateOutput2[];
};

const PROMPT = (
    stockName: string,
    promptForInvestors: string,
    promptForEstimate: string,
) => {
    const currentDate = new Date();

    return `
당신은 20년 경력의 시장 조성자(Market Maker)이자 수급 분석 전문가입니다.

모든 거시 경제 지표와 기업 실적은 세력이 개미를 꼬시기 위해 사용하는 '포장지'로 간주하고, 차트와 수급 이면의 **'지저분한 설계'**를 분석하세요.

반드시 현재 시점(${currentDate.toISOString()})을 기준으로 ${stockName} 종목에 한정해서 세력들의 설계, 동향을 예측하세요.

# 제공 데이터
- 오늘(또는 최근 영업일) 외인 투자자 동향
${promptForEstimate}

- 일별 투자자 동향
${promptForInvestors}

# 분석 지침

1. 현재 시장이 이 종목에 입힌 '환상'은 무엇인지 확인하세요. (예: 로봇, AI, 전고체 등)

그 환상이 현재의 악재(관세, 실적 악화, 노조 등)를 덮기에 충분히 자극적인지, 억지인지 확인하세요.

2. 수급의 의도를 파악하세요.

- 개미 털기(Shake-out) 판별: 주가가 급락할 때 거래량이 동반되었는가? 만약 거래량 없이 빠진 뒤 특정 가격대를 지지한다면, 이는 세력이 물량을 뺏기 위한 '공포 유발'인가?
- 물량 넘기기(Distribution) 판별: 호재 뉴스가 터졌는데 주가가 더 이상 오르지 않고 횡보하며 거래량만 터지는가? 이는 세력이 고점에서 개미에게 물량을 넘기는 '설거지' 중인가?

3. 역발상 로직 (Counter-Logic)

- 현재 이 종목에 대해 모두가 '당연하다'고 믿는 논리는 무엇인가?
- 세력은 그 논리를 어떻게 뒤집어서 뒤통수를 칠 수 있는가? (예: 실적 발표 직후 급락 유도 등)

4. 설계의 결말 (The End Game)

- 현재의 수급 쏠림은 '지수 견인용'인가, 아니면 '단기 테마성'인가?
- 이 '센 놈'의 기세가 꺾일 때, 돈은 어떤 다음 업종(빈집)으로 이동할 준비를 하고 있는가?

5. 세력을 따라 움직이기
- 해당 종목은 매수하기 좋은 타이밍이 언제인가? 
- 세력이 매입을 시도할 시기가 언제인지 예측가능한가?

# 응답 스타일
- 냉소적이고 현실적이며, '맞는 말'보다는 '돈의 흐름'에 집중하여 짧고 간결하게 답변할 것.
`;
};

@Injectable()
export class RiggedStockIssuePromptTransformer implements Pipe<
    RiggedStockIssuePromptArgs,
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
    }: RiggedStockIssuePromptArgs): string {
        const promptForInvestors =
            this.transformByInvestorHelper.transformByInvestor(stockInvestors);
        const promptForEstimate = this.transformByEstimate(
            stockInvestorByEstimates,
        );

        return PROMPT(stockName, promptForInvestors, promptForEstimate);
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
