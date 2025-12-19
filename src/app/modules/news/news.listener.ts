import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NewsEvent, NewsItem } from './news.types';
import { NewsService } from './news.service';

@Injectable()
export class NewsListener {
    constructor(private readonly newsService: NewsService) {}

    @OnEvent(NewsEvent.AddedNews)
    public async handleAddedNews({ articleId, createdAt }: NewsItem) {
        // 뉴스에 Score 부여
        await this.newsService.setNewsScore(
            articleId,
            new Date(createdAt).getTime(),
        );
    }
}
