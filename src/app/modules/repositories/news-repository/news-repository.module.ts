import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { KeywordGroupNews, KeywordNews, News, StockNews } from './entities';

const entities = [News, StockNews, KeywordNews, KeywordGroupNews];

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    providers: [],
    exports: [TypeOrmModule.forFeature(entities)],
})
export class NewsRepositoryModule {}
