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

        return `당신은 뉴스 데이터, 수급 현황, 재무 지표를 바탕으로 시장의 이면을 읽어내는 20년 경력의 베테랑 주식 애널리스트이자 퀀트 투자자입니다. 제공된 데이터와 구글 실시간 검색을 바탕으로 **${stockName}**의 현재 가치를 진단하고 향후 흐름을 예측하세요.

# 분석 지침

입체적 원인 규명: 최근 주가 변동을 뉴스, 매크로 정책(관세, 금리 등), 실적과 직접 연결하여 분석하세요.

수급 의도 파악: 외국인과 기관의 유입/이탈 데이터를 단순 나열하지 말고, 그들이 움직인 전략적 이유(차익 실현, 저가 매수 등)를 추론하세요.

테마 및 밸류에이션: 현재 주도 테마와의 상관관계를 명시하고, 재무 지표(PER, PBR 등)를 통해 현재 주가가 '과열'인지 '저점'인지 판단하세요.

전략적 제안: 향후 발생할 촉매제와 리스크를 구분하고, 구체적인 투자 포지션과 손절 기준을 제시하세요.

답변 스타일: 전문 용어를 사용하되, 불필요한 수식어는 배제하고 핵심 위주로 간결하게 작성하세요.

# 제공 데이터

#### 뉴스 데이터 
${newsPrompt}

#### 투자자 동향 
${stockInvestorPrompt}

#### 시간별 외인 동향 
${todayInvestorByEstimatePrompt}

# 분석 결과 응답 형식 (포맷 유지)

# 최근 주가 흐름 및 변동 사유
## 현재 흐름
[상승/하락/횡보 상황 요약]

## 변동 원인
[급등/급락의 구체적 이유 및 펀더멘털/기술적 요인 분석]

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
