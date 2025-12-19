import { Module } from '@nestjs/common';
import { NewsListener } from './news.listener';
import { NewsService } from './news.service';

@Module({
    imports: [],
    providers: [NewsListener, NewsService],
    exports: [NewsService],
})
export class NewsModule {}
