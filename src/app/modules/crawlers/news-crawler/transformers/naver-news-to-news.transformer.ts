import { NaverApiNewsItem } from '@modules/naver/naver-api';
import {
    NewsCategory,
    NewsItem,
} from '@app/modules/repositories/news-repository';

export class NaverNewsToNewsTransformer {
    public transform(naverNewsItem: NaverApiNewsItem): NewsItem {
        return {
            articleId: naverNewsItem.link,
            category: NewsCategory.Naver,
            title: naverNewsItem.title,
            description: naverNewsItem.description,
            link: naverNewsItem.link,
            stockCodes: [],
            createdAt: new Date(naverNewsItem.pubDate).toISOString(),
        };
    }
}
