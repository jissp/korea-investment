import { Module } from '@nestjs/common';
import { NewsRepositoryModule } from '@app/modules/repositories/news-repository';
import { GetNewsByCategoryUseCase, GetNewsUseCase } from './use-cases';
import { NewsController } from './news.controller';

@Module({
    imports: [NewsRepositoryModule],
    controllers: [NewsController],
    providers: [GetNewsUseCase, GetNewsByCategoryUseCase],
})
export class NewsModule {}
