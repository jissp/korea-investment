import { sortBy, uniqBy } from 'lodash';
import { Injectable } from '@nestjs/common';
import { Pipe } from '@common/types';
import { NaverApiNewsItem } from '@modules/naver/naver-api';
import { News } from '@app/modules/repositories/news';

const MAX_NEWS_ITEMS = 100;

type PromptArgs = {
    naverNewsItems?: NaverApiNewsItem[];
    news: News[];
};

interface NormalizedNews {
    title: string;
    description: string;
    publishedAt: string;
}

const PROMPT = (transformedNewsPrompt: string) => {
    const currentDate = new Date();

    return `
# 당신은 전문 금융 시장 분석가 (Financial Market Analyst) 입니다.

제공된 데이터 ${currentDate.toISOString()} 기준 최신 시장 정보를 결합하여 객관적인 시장 리포트를 작성하세요.

# 제공 데이터
${transformedNewsPrompt}

# 분석 지침

1. 제공 데이터를 "예시"와 같이 핵심 키워드와 이슈를 추출하세요. 갯수 상한선은 존재하지 않으니 최대한 나열하시면 됩니다.
예시 )
\`\`\`
# 국내 증시 및 정책 이슈
- 코스피 5000선 시대: 장중 5023선 경신 후 5000선 안팎에서 공방 및 차익실현 조정.
- ...

# 주도 업종 및 테마별 핵심 이슈
- 반도체 (AI/HBM): * 삼성전자·SK하이닉스 HBM4 전략 공개 임박.
- 삼성전자의 엔비디아/AMD향 HBM4 최초 납품 보도.
- ...

# 글로벌 거시 경제 및 지정학적 리스크
- 트럼프 관세 리스크: 캐나다에 100% 관세 부과 위협. 나스닥 선물 급락 및 비트코인 8.7만 달러 붕괴 등 위험회피 심리 확산.
- 미국 정세 불안: ICE 총격 사건 여파로 인한 미 연방정부 셧다운 우려.
- 환율 및 금리: * 미·일 환시 협조 개입 관측에 엔화 급등(달러당 153엔대).
- 달러-원 환율 1,440원대 급락 출발 전망 및 국채선물 상승.
- 주요 일정: 이번 주 FOMC 금리 결정 및 빅테크(애플, MS, 메타 등) 실적 발표가 증시 분수령.

# 원자재 및 에너지
금(Gold): 역사상 최초 온스당 5,000달러 돌파.
천연가스: 미국 한파로 생산 10% 중단 및 관련 ETN 급등.
공급망 협력: 고려아연의 다보스 핵심광물 협력 및 폐기물 내 4조 원 규모 금속 회수 전망.

# ...
\`\`\`

2. 실시간 데이터 통합: 위에서 확인한 이슈별로 실시간 정보를 확인합니다.
- 매크로 정책(관세, 금리 등)
- 국내 상법 개정 및 밸류업 정책
- 정상회담 또는 대통령 발언
- 지정학적 / 지경학적 리스크 (전쟁, 내전 등)
- 그 외 기타 사항

3. 관련 종목들의 실적 발표 예정일, 최근 공시 정보 등을 확인하세요.

4. 위에서 확인한 데이터들이 실제 존재하는 데이터인지 재확인하고, 출처가 불분명한 루머는 제외하십시오.

5. 확인한 데이터들을 그대로 응답하세요.
`;
};

@Injectable()
export class NewsPromptTransformer implements Pipe<PromptArgs, string> {
    /**
     * @param value
     */
    transform({ naverNewsItems, news }: PromptArgs): string {
        const normalizedNewsItems = [
            ...news.map((news) => this.normalizeNewsByNews(news)),
            ...(naverNewsItems ?? []).map((news) =>
                this.normalizeNewsByNaverNews(news),
            ),
        ];

        const sortedNewsItems = this.extractNewsItems(normalizedNewsItems);
        const latestNewsItems = sortedNewsItems.slice(0, MAX_NEWS_ITEMS);

        const transformedNewsPrompt = latestNewsItems
            .map((newsItem) => this.transformRowPrompt(newsItem))
            .join('\n');

        return PROMPT(transformedNewsPrompt);
    }

    /**
     * 개별 뉴스 정보를 프롬프트로 변환합니다.
     * @param title
     * @param description
     * @param publishedAt
     * @private
     */
    private transformRowPrompt({
        title,
        description,
        publishedAt,
    }: NormalizedNews) {
        if (!description) {
            return `- ${title}`;
        }

        return `- ${title} (${publishedAt})  \n${description}`;
    }

    /**
     * 뉴스를 일반화 시킵니다.
     * @param news
     * @private
     */
    private normalizeNewsByNews(news: News): NormalizedNews {
        return {
            title: this.removeTag(news.title),
            description: news.description
                ? this.removeTag(news.description)
                : '',
            publishedAt: news.publishedAt.toISOString(),
        };
    }

    /**
     * 네이버 뉴스를 일반화 시킵니다.
     * @param news
     * @private
     */
    private normalizeNewsByNaverNews(news: NaverApiNewsItem): NormalizedNews {
        return {
            title: this.removeTag(news.title),
            description: this.removeTag(news.description),
            publishedAt: news.pubDate,
        };
    }

    /**
     * 실시간으로 검색된 뉴스 정보를 추출합니다.
     * @param newsItems
     * @private
     */
    private extractNewsItems(newsItems: NormalizedNews[]) {
        if (newsItems.length === 0) {
            throw new Error('검색된 뉴스 정보가 없습니다.');
        }

        const sortedNewsItems = sortBy(newsItems, (newsItem) =>
            new Date(newsItem.publishedAt).getTime(),
        ).reverse();

        return uniqBy(sortedNewsItems, (newsItem) => newsItem.title);
    }

    /**
     * B HTML 태그를 제거합니다.
     * @param text
     * @private
     */
    private removeTag(text: string) {
        return text.replace('<b>', '').replace('</b>', '');
    }
}
