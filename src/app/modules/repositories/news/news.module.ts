import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { News } from './entities/news.entity';
import { NewsService } from './news.service';
import { StockNews } from './entities/stock-news.entity';
import { KeywordGroupNews } from './entities/keyword-group-news.entity';
import { KeywordNews } from './entities/keyword-news.entity';

const entities = [News, StockNews, KeywordNews, KeywordGroupNews];

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    providers: [NewsService],
    exports: [TypeOrmModule.forFeature(entities), NewsService],
})
export class NewsModule {}
