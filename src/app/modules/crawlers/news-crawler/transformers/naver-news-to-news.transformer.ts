import { NaverApiNewsItem } from '@modules/naver/naver-api';
import { NewsCategory, NewsDto } from '@app/modules/repositories/news';

export class NaverNewsToNewsTransformer {
    public transform(naverNewsItem: NaverApiNewsItem): NewsDto {
        return {
            articleId: naverNewsItem.link,
            category: NewsCategory.Naver,
            title: naverNewsItem.title,
            description: naverNewsItem.description,
            link: naverNewsItem.link,
            publishedAt: new Date(naverNewsItem.pubDate),
        };
    }
}
