import { Pipe } from '@common/types';
import { NaverApiNewsItem } from '@modules/naver/naver-api';
import { DomesticStockQuotationsInquireInvestorOutput } from '@modules/korea-investment/korea-investment-quotation-client';
import { NewsPromptTransformer } from './news-prompt.transformer';
import { StockInvestorPromptTransformer } from './stock-investor-prompt.transformer';

type AnalyzeStockPromptArgs = {
    stockName: string;
    naverNewsItems: NaverApiNewsItem[];
    stockInvestors: DomesticStockQuotationsInquireInvestorOutput[];
};

/**
 * 뉴스 정보를 프롬프트로 변환하는 역할의 클래스입니다.
 */
export class AnalyzeStockPromptTransformer implements Pipe<
    AnalyzeStockPromptArgs,
    string
> {
    /**
     * 뉴스 정보를 프롬프트로 변환합니다.
     * @param value
     */
    transform({
        stockName,
        naverNewsItems,
        stockInvestors,
    }: AnalyzeStockPromptArgs): string {
        const newsPromptTransformer = new NewsPromptTransformer();
        const stockInvestorPromptTransformer =
            new StockInvestorPromptTransformer();

        const newsPrompt = newsPromptTransformer.transform(naverNewsItems);
        const stockInvestorPrompt =
            stockInvestorPromptTransformer.transform(stockInvestors);

        return `당신은 뉴스 정보를 통해 주가의 흐름을 분석하고 예측하는 전문 주식 분석가이자 투자자입니다.
아래 지침을 따라 "${stockName}" 종목에 대해 분석하세요.

# 지침
1. 제공된 정보를 분석하세요.
${newsPrompt}
${stockInvestorPrompt}
3. 분석한 뉴스 정보를 통해 주가 흐름을 예측하고 분석하세요.
4. 추가로 참고하면 좋을 정보들을 제공하세요.
- 관련 주제, 테마, 섹터 등 주가에 영향을 줄만한 최신 정보면 좋습니다.
5. 분석 결과는 반드시 분석 결과 응답 형식으로 답변하세요.
6. 분석 결과는 핵심만 간결하게 작성하세요.

# 분석 결과 응답 형식
## 최근 주식 동향
[설명]

## 최근 투자자 동향
[설명]

## 주가 전망
- **상방 요인**: [상방 요인 설명]
- **하방 요인**: [하방 요인 설명]

## 추가로 참고하면 좋을 정보
[정보]

## 연관 주식 종목 목록
- **[종목명]**: [사유]
- ...

## 핵심 키워드
- **[키워드명]**: [사유]
- ...

## 추천하는 포지션과 사유
- **[포지션]**
- [사유]
`;
    }
}
