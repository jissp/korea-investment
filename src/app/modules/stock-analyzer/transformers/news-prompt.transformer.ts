import * as _ from 'lodash';
import { Pipe } from '@common/types';
import { NaverApiNewsItem } from '@modules/naver/naver-api';
import { News, StockNews } from '@app/modules/repositories/news';

interface NewsPromptArgs {
    newsItems?: News[];
    naverNewsItems?: NaverApiNewsItem[];
    stockNewsItems?: StockNews[];
}

interface NormalizedNews {
    title: string;
    description: string;
    publishedAt: string;
}

/**
 * 뉴스 정보를 프롬프트로 변환하는 역할의 클래스입니다.
 */
export class NewsPromptTransformer implements Pipe<NewsPromptArgs, string> {
    private readonly MAX_NEWS_ITEMS = 100;

    /**
     * 뉴스 정보를 프롬프트로 변환합니다.
     * @param data
     */
    transform({
        newsItems = [],
        naverNewsItems = [],
        stockNewsItems = [],
    }: NewsPromptArgs): string {
        const normalizedNewsItems = [
            ...newsItems.map((news) => this.normalizeNewsByNews(news)),
            ...stockNewsItems.map((news) => this.normalizeNewsByNews(news)),
            ...naverNewsItems.map((news) =>
                this.normalizeNewsByNaverNews(news),
            ),
        ];
        const sortedNewsItems = this.extractNewsItems(normalizedNewsItems);
        const latestNewsItems = sortedNewsItems.slice(0, this.MAX_NEWS_ITEMS);

        return latestNewsItems
            .map((newsItem) => this.transformRowPrompt(newsItem))
            .join('\n');
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
     * B HTML 태그를 제거합니다.
     * @param text
     * @private
     */
    private removeTag(text: string) {
        return text.replace('<b>', '').replace('</b>', '');
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
}
