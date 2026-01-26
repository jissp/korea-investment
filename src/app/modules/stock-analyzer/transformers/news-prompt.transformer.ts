import * as _ from 'lodash';
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

제공된 데이터와 ${currentDate.toISOString()} 기준 최신 시장 정보를 결합하여 객관적인 시장 리포트를 작성하세요.

# 제공 데이터
${transformedNewsPrompt}

# 분석 지침

1. 현재 프로젝트 파일은 무시하고 당신이 가진 지식으로만 답변하세요.

2. 실시간 데이터 통합: Google 검색을 통해 제공된 데이터와 관련있는 현재 국내외 시장의 주요 이슈를 확인하세요.
- 매크로 정책(관세, 금리 등)
- 국내 상법 개정 및 밸류업 정책
- 정상회담 또는 대통령 발언
- 지정학적 / 지경학적 리스크 (전쟁, 내전 등)
- 그 외 기타 사항

3. 시장 수급 데이터: 영업일 기준으로 해당 종목의 최근 3일간 선물 거래량, 미결제약정, 외인/기관 매매 패턴을 확인하세요.

4. 위에서 확인한 데이터들이 실제 존재하는 데이터인지 재확인하고, 출처가 불분명한 루머는 제외하십시오.

5. 위에서 확인한 데이터들을 분석하여 불필요한 내용은 배제하고 리포트를 작성하세요.
`;
};

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
     * @param newsItem
     * @private
     */
    private transformRowPrompt({ title, description }: NormalizedNews) {
        if (!description) {
            return `- ${title}`;
        }

        return `- ${title}  \n${description}`;
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

        const sortedNewsItems = _.sortBy(newsItems, (newsItem) =>
            new Date(newsItem.publishedAt).getTime(),
        ).reverse();

        return _.uniqBy(sortedNewsItems, (newsItem) => newsItem.title);
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
