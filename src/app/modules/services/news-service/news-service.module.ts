import { Module } from '@nestjs/common';
import { NewsRepositoryModule } from '@app/modules/repositories/news-repository';
import { NewsService } from './news.service';

@Module({
    imports: [NewsRepositoryModule],
    providers: [NewsService],
    exports: [NewsService],
})
export class NewsServiceModule {}
