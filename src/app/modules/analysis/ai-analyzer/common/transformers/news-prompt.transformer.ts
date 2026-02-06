import { sortBy, uniqBy } from 'lodash';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Pipe } from '@common/types';
import { NaverApiNewsItem } from '@modules/naver/naver-api';
import { News } from '@app/modules/repositories/news';
import { formatTemplate } from '@app/common/domains';
import { NEWS_PROMPT_TEMPLATE } from '../prompts';

const MAX_NEWS_ITEMS = 100;

type TransformerArgs = {
    news: News[];
    naverNewsItems?: NaverApiNewsItem[];
};

interface NormalizedNews {
    title: string;
    description: string;
    publishedAt: string;
}

@Injectable()
export class NewsPromptTransformer implements Pipe<TransformerArgs, string> {
    /**
     * @param value
     */
    transform({ news, naverNewsItems }: TransformerArgs): string {
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

        return formatTemplate(NEWS_PROMPT_TEMPLATE, {
            currentDate: new Date().toISOString(),
            transformedNewsPrompt,
        });
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
            throw new NotFoundException('검색된 뉴스 정보가 없습니다.');
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
