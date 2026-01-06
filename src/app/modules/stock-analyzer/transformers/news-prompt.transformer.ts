import * as _ from 'lodash';
import { Pipe } from '@common/types';
import { NaverApiNewsItem } from '@modules/naver/naver-api';

/**
 * 뉴스 정보를 프롬프트로 변환하는 역할의 클래스입니다.
 */
export class NewsPromptTransformer implements Pipe<NaverApiNewsItem[], string> {
    private readonly MAX_NEWS_ITEMS = 100;

    /**
     * 뉴스 정보를 프롬프트로 변환합니다.
     * @param naverNewsItems
     */
    transform(naverNewsItems: NaverApiNewsItem[]): string {
        const newsItems = this.extractNewsItems(naverNewsItems);
        const latestNewsItems = newsItems.slice(0, this.MAX_NEWS_ITEMS);

        const newsPrompt = latestNewsItems
            .map((newsItem) => this.transformRowPrompt(newsItem))
            .join('\n');

        return `뉴스 정보 \n${newsPrompt}`;
    }

    /**
     * 개별 뉴스 정보를 프롬프트로 변환합니다.
     * @param newsItem
     * @private
     */
    private transformRowPrompt(newsItem: NaverApiNewsItem) {
        return `- 뉴스 제목: ${newsItem.title}, 뉴스 내용: ${newsItem.description}, 뉴스 링크: ${newsItem.link}`;
    }

    /**
     * 실시간으로 검색된 뉴스 정보를 추출합니다.
     * @param newsItems
     * @private
     */
    private extractNewsItems(newsItems: NaverApiNewsItem[]) {
        if (newsItems.length === 0) {
            throw new Error('실시간으로 검색된 뉴스 정보가 없습니다.');
        }

        return _.sortBy(newsItems, (newsItem) =>
            new Date(newsItem.pubDate).getTime(),
        ).reverse();
    }
}
