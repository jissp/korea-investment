import { NewsCategory, NewsItem } from '@app/modules/news';
import { NaverApiNewsItem } from '@modules/naver';

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
