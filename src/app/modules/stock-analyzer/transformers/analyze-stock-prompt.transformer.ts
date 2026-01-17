import { Pipe } from '@common/types';
import { NaverApiNewsItem } from '@modules/naver/naver-api';
import {
    DomesticStockInvestorTrendEstimateOutput2,
    DomesticStockQuotationsInquireInvestorOutput,
} from '@modules/korea-investment/korea-investment-quotation-client';
import { StockNews } from '@app/modules/repositories/news';
import { NewsPromptTransformer } from './news-prompt.transformer';
import { StockInvestorPromptTransformer } from './stock-investor-prompt.transformer';
import { StockInvestorByEstimatePromptTransformer } from './stock-investor-by-estimate-prompt.transformer';

type AnalyzeStockPromptArgs = {
    stockName: string;
    naverNewsItems: NaverApiNewsItem[];
    stockNewsItems: StockNews[];
    stockInvestors: DomesticStockQuotationsInquireInvestorOutput[];
    stockInvestorByEstimates: DomesticStockInvestorTrendEstimateOutput2[];
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
        stockNewsItems,
        stockInvestors,
        stockInvestorByEstimates,
    }: AnalyzeStockPromptArgs): string {
        const newsPrompt = new NewsPromptTransformer().transform({
            naverNewsItems,
            stockNewsItems,
        });
        const stockInvestorPrompt =
            new StockInvestorPromptTransformer().transform(stockInvestors);
        const todayInvestorByEstimatePrompt =
            new StockInvestorByEstimatePromptTransformer().transform(
                stockInvestorByEstimates,
            );

        return `당신은 20년 경력의 베테랑 애널리스트이자 퀀트 투자 전문가입니다. **${stockName}**에 대해 다음 필수 사항을 따라 데이터를 통합 분석하여 현재 가치를 진단하고 향후 3~6개월의 흐름을 예측하세요.

# 필수 사항

1. 제공 데이터(Primary): 제가 직접 입력한 뉴스, 수급, 재무 지표를 최우선 근거로 삼아 핵심 동인을 파악하세요.

2. 실시간 데이터(Secondary): Google 검색을 통해 현재 시점의 실시간 시장가(Price Action), 최신 뉴스, 그리고 제가 제공한 데이터 이후의 변화된 시장 반응을 보완하세요.
- 이 때 국내 시장, 해외 시장 두 케이스에 대해서 분석하고, 각 시장별 주요 이슈 사항을 반영하세요.

3. 통합 진단: 퀀트적 관점에서 재무 건전성과 수급 강도를 평가하고, 베테랑 애널리스트의 관점에서 시장 이면의 '내러티브(Narrative)'를 해석하세요.

4. 입체적 원인 규명: 최근 주가 변동을 뉴스, 매크로 정책(관세, 금리 등), 실적과 직접 연결하여 분석하세요.

5. 테마 및 밸류에이션: 현재 주도 테마와의 상관관계를 명시하고, 재무 지표(PER, PBR 등)를 통해 현재 주가가 '과열'인지 '저점'인지 판단하세요.

6. 공시 및 규제: 최근 공시 사항과 규제 변화를 고려하여 투자 전략에 영향을 미쳤는지 분석하세요.

7. 수급 의도 파악: 제공된 투자자 동향과 시간별 외인 동향 데이터를 기반하여 매수세/매도세가 발생한 근거를 분석하세요.

8. 해당 종목이 배당주라면, 가장 빠른 배당일은 언제인지 확인 후 제공하세요.

# 제공 데이터

#### 뉴스 데이터 
${newsPrompt}

#### 투자자 동향 
${stockInvestorPrompt}

#### 시간별 외인 동향 
${todayInvestorByEstimatePrompt}

# 분석 결과 응답 형식 (포맷 유지)

# ${stockName}
[해당 종목에 대한 간략한 설명]

# 최근 주가 흐름 및 변동 사유
## 현재 흐름
[상승/하락/횡보 상황 요약]

## 변동 원인
[급등/급락의 구체적 이유 및 펀더멘털/기술적 요인 분석]

# 전망

## 단기적 전망
[단기적 전망 설명]

## 중기적 전망
[중기적 전망 설명]

## 장기적 전망
[장기적 전망 설명]

# 공시 / 배당 등 정보
[공시, 배당, 실적 발표 등 정보 설명]

## 주요 투자자 매매 동향
수급 특징
[외국인/기관의 매매 패턴 및 수급 주체별 의도 분석]

# 핵심 이슈 및 시장 환경
## 현재 이슈
[주가에 영향을 주는 매크로 환경 및 개별 뉴스, 산업 내 위치]

## 모니터링 포인트
[향후 주가 방향을 결정지을 핵심 일정, 지표, 기술적 지지/저항선]

# 주가 전망 (Short-term & Mid-term)
## 상방 요인
[주가를 끌어올릴 핵심 촉매제 및 목표치]

## 하방 요인
[주의해야 할 리스크 및 손절 라인]

## 연관 종목 및 섹터
[종목명]: [상관관계 및 섹터 내 비교 분석]

# 핵심 키워드
[키워드]: [선정 이유]

# 투자 포지션 제안
[추천 포지션: 매수 / 보유 / 관망 / 매도]

사유: [한 줄 요약]
\`\`\``;
    }
}
