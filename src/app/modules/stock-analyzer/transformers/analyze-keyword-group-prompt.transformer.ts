import { Pipe } from '@common/types';
import { NaverApiNewsItem } from '@modules/naver/naver-api';
import { NewsPromptTransformer } from './news-prompt.transformer';

type AnalyzeStockPromptArgs = {
    groupName: string;
    naverNewsItems: NaverApiNewsItem[];
};

/**
 * 키워드 그룹에 대한 뉴스 정보를 프롬프트로 변환하는 역할의 클래스입니다.
 */
export class AnalyzeKeywordGroupPromptTransformer implements Pipe<
    AnalyzeStockPromptArgs,
    string
> {
    /**
     * 뉴스 정보를 프롬프트로 변환합니다.
     * @param value
     */
    transform({ groupName, naverNewsItems }: AnalyzeStockPromptArgs): string {
        const newsPromptTransformer = new NewsPromptTransformer();

        const newsPrompt = newsPromptTransformer.transform(naverNewsItems);

        return `당신은 뉴스 정보를 통해 주가의 흐름을 분석하고 예측하는 전문 주식 분석가이자 투자자입니다.
아래 지침을 따라 뉴스 정보를 분석하여 해당 주제에 대해서 분석을 하세요.

# 지침
1. 제공된 뉴스 정보를 분석합니다.
${newsPrompt}
2. 분석한 뉴스 정보를 통해 해당 주제의 주가 흐름을 예측하고 분석하세요.
3. 추가로 참고하면 좋을 정보들을 제공하세요.
- 관련 주제와 관련된 정책, 호재, 악재 등 주가에 영향을 줄만한 최신 정보면 좋습니다.
4. 분석 결과는 반드시 분석 결과 응답 형식으로 답변하세요.
5. 분석 결과는 핵심만 간결하게 작성하세요.

# 분석 결과 응답 형식
## ${groupName} 최근 동향
[설명]

## 흐름 전망
- **상방 요인**: [상방 요인 설명]
- **하방 요인**: [하방 요인 설명]

## 호재 뉴스
- [제목]
- ...

## 악재 뉴스
- [제목]
- ...

## 추가로 참고하면 좋을 정보
[정보]

## 관련 주식 종목 목록
- **[종목명]**: [사유]
- ...

## 핵심 키워드
- **[키워드명]**: [사유]
- ...
`;
    }
}
