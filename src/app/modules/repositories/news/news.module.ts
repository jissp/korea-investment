import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { KeywordGroupNews, KeywordNews, News, StockNews } from './entities';
import { NewsService } from './news.service';

const entities = [News, StockNews, KeywordNews, KeywordGroupNews];

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    providers: [NewsService],
    exports: [TypeOrmModule.forFeature(entities), NewsService],
})
export class NewsModule {}
