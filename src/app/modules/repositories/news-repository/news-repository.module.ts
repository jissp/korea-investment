import { Module } from '@nestjs/common';
import { NewsRepository } from './news.repository';

@Module({
    imports: [],
    providers: [NewsRepository],
    exports: [NewsRepository],
})
export class NewsRepositoryModule {}
