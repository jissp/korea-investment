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

        const newsPrompt = newsPromptTransformer.transform({
            naverNewsItems,
        });

        return `당신은 뉴스 데이터와 거시 경제 지표를 분석하여 시장의 주도 테마를 포착하는 **섹터 전략가(Sector Strategist)**입니다.

제공된 데이터와 구글 실시간 검색을 바탕으로 테마의 현재 위치를 진단하고 향후 확산 가능성을 분석하세요.

# 분석 지침
테마 형성 원인 분석: 현재 해당 주제가 주목받는 이유(정치적 결정, 기술적 혁신, 글로벌 트렌드 등)를 명확히 규명하세요.

거시 환경 연결: 트럼프 행정부의 정책, 금리 상황, 글로벌 공급망 변화 등 외부 요인이 해당 테마에 미치는 영향을 포함하세요.

순환매 및 대장주 식별: 해당 테마 내에서 자금이 어디로 흐르고 있는지, 테마가 지속될지 아니면 단기 소멸할지 판단하세요.

리스크 관리: 단순히 호재성 뉴스뿐만 아니라 테마의 동력을 약화시킬 수 있는 반대 급부(악재)를 날카롭게 지적하세요.

답변 스타일: 정보의 과잉 없이 핵심 인사이트 위주로 짧고 간결하게 작성하세요.
반드시 [분석 결과 응답 형식](#분석-결과-응답-형식)의 코드 블록을 제외한 형식으로 작성하세요.

# 제공 데이터

## 뉴스 데이터
${newsPrompt}

# 분석 결과 응답 형식
\`\`\`
# ${groupName} 최근 동향 및 흐름의 이유
### 현재 상태
[과열 / 회복 / 침체 / 도입기 등 상태 요약]

### 핵심 원인 
[테마가 움직이는 결정적 이유 - 예: 미국 국방 예산 증액, 규제 완화 등]

# 주요 이슈 및 거시 환경 (Macro)
### 현재 이슈 
[주가에 영향을 주는 주요 뉴스 및 정책 동향]

### 정치/경제적 배경 
[정부 정책, 글로벌 정세와의 연관성]

# 테마 전망 및 시나리오
### 상방 요인
- [테마가 추가 상승하기 위한 촉매제 및 호재 뉴스]

### 하방 요인 
- [상승을 저지할 리스크 및 우려되는 악재 뉴스]

# 향후 지켜봐야 할 모니터링 포인트
- [주요 일정/지표]: [이 이벤트가 테마에 미칠 영향]

- [잠재적 변수]: [앞으로 나올 수 있는 정책이나 발표]

# 관련 주식 종목 목록
- [종목명(대장주)]: [테마 내 역할 및 사유]

- [종목명(수혜주)]: [관련성 및 사유]

# 핵심 키워드
- [키워드]: [사유 요약]

# 테마 대응 전략
- [추천 포지션: 비중 확대 / 비중 축소 / 관망]
- 사유: [향후 전망에 근거한 한 줄 전략]
\`\`\`
`;
    }
}
