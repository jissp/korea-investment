import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { News } from '@app/modules/repositories/news-repository';
import { NewsResponse } from '@app/modules/domain/news/dto/responses/news.response';

@Injectable()
export class GetNewsUseCase implements BaseUseCase<void, NewsResponse> {
    constructor(
        @InjectRepository(News)
        private readonly newsRepository: Repository<News>,
    ) {}

    async execute(): Promise<NewsResponse> {
        return {
            data: await this.getNews(),
        };
    }

    private async getNews() {
        return this.newsRepository.find({
            order: { publishedAt: 'DESC' },
        });
    }
}
