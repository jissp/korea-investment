import { Module } from '@nestjs/common';
import { NewsService } from './news.service';

@Module({
    imports: [],
    providers: [NewsService],
    exports: [NewsService],
})
export class NewsModule {}
