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
        const title = this.removeTag(newsItem.title);
        const description = this.removeTag(newsItem.description);

        return `- ${title}  \n${description}`;
    }

    private removeTag(text: string) {
        return text.replace('<b>', '').replace('</b>', '');
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

        const sortedNewsItems = _.sortBy(newsItems, (newsItem) =>
            new Date(newsItem.pubDate).getTime(),
        ).reverse();

        return _.uniqBy(sortedNewsItems, (newsItem) => newsItem.description);
    }
}
