import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { News, NewsCategory } from '@app/modules/repositories/news-repository';
import { NewsResponse } from '@app/modules/domain/news/dto/responses/news.response';

interface GetNewsByCategoryUseCaseParams {
    category: NewsCategory;
}

@Injectable()
export class GetNewsByCategoryUseCase implements BaseUseCase<
    GetNewsByCategoryUseCaseParams,
    NewsResponse
> {
    constructor(
        @InjectRepository(News)
        private readonly newsRepository: Repository<News>,
    ) {}

    async execute({
        category,
    }: GetNewsByCategoryUseCaseParams): Promise<NewsResponse> {
        return {
            data: await this.getNewsByCategory(category),
        };
    }

    private async getNewsByCategory(category: NewsCategory) {
        return this.newsRepository.find({
            where: {
                category,
            },
            order: { publishedAt: 'DESC' },
        });
    }
}
