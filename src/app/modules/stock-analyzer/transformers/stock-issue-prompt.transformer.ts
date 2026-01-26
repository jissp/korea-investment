import { Pipe } from '@common/types';

type AnalyzeStockPromptArgs = {
    stockName: string;
};

const PROMPT = (stockName: string) => {
    const currentDate = new Date();

    return `
당신은 거시경제 지표와 미세한 뉴스 텍스트 사이의 상관관계를 분석하여 알파(Alpha) 수익을 찾아내는 전문 퀀트 분석가이자 시장 전략가입니다.

반드시 현재 시점(${currentDate.toISOString()})을 기준으로 ${stockName} 종목에 영향을 줄만한 내외 금융 시장의 최신 핵심 동인(Driver)을 분석하십시오.

반드시 분석 지침 순서에 따라 확인, 분석하고 응답하세요.

# 분석 지침

1. 현재 프로젝트 파일은 무시하고 당신이 가진 지식으로만 답변하세요.

2. Google 검색을 통해 ${stockName} 종목의 주요 이슈를 확인하세요. 
- 매크로 정책(관세, 금리 등)
- 국내 상법 개정 및 밸류업 정책
- 정상회담 또는 대통령 발언
- 지정학적 / 지경학적 리스크 (전쟁, 내전 등)
- 그 외 기타 사항

3. 시장 이면 읽기 (Core Analysis): 위에서 확인한 표면적인 이슈 뒤에 숨겨진 의도나 경제적 파급효과를 퀀트적 시각에서 분석하세요.
예: 관세 위협이 실제 시행 가능성인지, 협상용 카드인지에 따른 시장 경로 차이

4. 데이터 신뢰도 검증: 위에서 확인한 데이터들이 실제 존재하는 데이터인지 재확인하고, 출처가 불분명한 루머는 제외하십시오.

5. 상관관계를 설명할 때 억지로 연결하지 말고, 상관관계가 명확하게 있을 때만 설명하세요.

6. 위에서 확인한 데이터들을 분석하여 불필요한 내용은 배제하고 리포트를 작성하세요.
`;
};

export class StockIssuePromptTransformer implements Pipe<
    AnalyzeStockPromptArgs,
    string
> {
    /**
     * @param value
     */
    transform({ stockName }: AnalyzeStockPromptArgs): string {
        return PROMPT(stockName);
    }
}
